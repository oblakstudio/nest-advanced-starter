import { Inject, Injectable, Logger } from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client, BucketItem } from 'minio';
import { MinIoConfig } from '@common/config';
import {
  Observable,
  Subscriber,
  catchError,
  filter,
  forkJoin,
  from,
  iif,
  map,
  mergeMap,
  of,
  reduce,
  switchMap,
  toArray,
} from 'rxjs';
import { HelperService } from '@common/helpers';

@Injectable()
export class MinIoService {
  private readonly logger = new Logger(MinIoService.name);

  constructor(
    private readonly config: MinIoConfig,
    @Inject(MINIO_CONNECTION) private readonly client: Client,
  ) {}

  getAllFiles(bucketName: string): Observable<string[]> {
    return from(this.client.listObjects(bucketName, undefined, true)).pipe(
      map((item: BucketItem) => item.name),
      toArray(),
    );
  }

  deleteAllFiles(bucketName: string): Observable<number> {
    return this.getAllFiles(bucketName).pipe(
      switchMap((filenames) =>
        from(HelperService.splitToChunks(filenames, 20)),
      ),
      mergeMap((batch) => this.deleteFileBatch(bucketName, batch), 100),
      reduce((acc, val) => acc + val, 0),
    );
  }

  private deleteFileBatch(
    bucketName: string,
    batch: string[],
  ): Observable<number> {
    const tasks = batch.map((filename) =>
      this.deleteFile(bucketName, filename).pipe(catchError(() => of(false))),
    );

    return forkJoin(tasks).pipe(
      map((results: boolean[]) => results.filter(Boolean).length),
    );
  }

  deleteFile(bucketName: string, fileName: string): Observable<boolean> {
    return this.fileExists(bucketName, fileName).pipe(
      switchMap((exists) =>
        iif(
          () => exists,
          from(this.client.removeObject(bucketName, fileName)).pipe(
            map(() => true),
          ),
          of(false),
        ),
      ),
    );
  }

  // #region File check
  checkFiles(bucket: string, files: string[]): Observable<string[]> {
    return from(HelperService.splitToChunks(files, 100)).pipe(
      mergeMap((fileChunk) => this.checkFilesInChunk(bucket, fileChunk), 5), // 5 chunks in parallel
      catchError(() => of([] as string[])),
      reduce((acc, chunk) => acc.concat(chunk), [] as string[]),
    );
  }

  private checkFilesInChunk(
    bucket: string,
    fileChunk: string[],
  ): Observable<string[]> {
    return from(fileChunk).pipe(
      mergeMap((file) =>
        this.fileExists(bucket, file).pipe(
          map((exists) => (exists ? '' : file)),
        ),
      ),
      filter((image) => image !== ''),
      toArray(),
      catchError((err) => {
        this.logger.error(
          `Failed to check files in bucket ${bucket}: ${err.message}`,
        );
        return of([]);
      }),
    );
  }

  fileExists(bucket: string, filename: string): Observable<boolean> {
    return from(this.client.statObject(bucket, filename)).pipe(
      map((stat) => stat.size > 0),
      catchError(() => of(false)),
    );
  }
  // #endregion

  //#region File mgmt
  uploadFile(
    fileData: Buffer,
    bucket: string,
    fileName: string,
  ): Observable<boolean> {
    return from(
      this.client.putObject(bucket, fileName, fileData, {
        'content-type': this.getMimeType(fileName),
      }),
    ).pipe(
      switchMap(() => this.fileExists(bucket, fileName)),
      catchError((err) => {
        this.logger.error(
          `Failed to upload file ${fileName} to bucket ${bucket}: ${err.message}`,
        );
        return of(false);
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getMimeType(_filename: string): string {
    return '';
  }

  getFile(bucket: string, fileName: string): Observable<Buffer> {
    return new Observable((observer: Subscriber<Buffer>) => {
      this.client
        .getObject(bucket, fileName)
        .then((data) => {
          const stream = data;
          const chunks: Uint8Array[] = [];

          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('error', (err) => observer.error(err));
          stream.on('end', () => {
            observer.next(Buffer.concat(chunks));
            observer.complete();
          });
        })
        .catch((err) => observer.error(err));
    });
  }

  // #endregion

  // Private upload public download
  private async setPolicy(bucketName: string): Promise<void> {
    const policy = {
      Version: '2012-10-17',
      ID: 'ImagePolicy',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: ['s3:GetBucketLocation'],
          Resource: [`arn:aws:s3:::${bucketName}`],
        },
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
    return await this.client.setBucketPolicy(
      bucketName,
      JSON.stringify(policy),
    );
  }
  //#endregion
}
