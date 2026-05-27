import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/common/storage/s3.service';

import type {
  TextItem,
  TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api';

@Injectable()
export class PdfExtractorService {
  constructor(private readonly s3Service: S3Service) {}

  async extract(fileKey: string): Promise<string> {
    const s3Object = await this.s3Service.getObject(fileKey);

    const data = new Uint8Array(s3Object.Body as Buffer);

    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const pdf = await getDocument({ data }).promise;

    const pagePromises = Array.from(
      { length: pdf.numPages },
      async (_, index) => {
        const page = await pdf.getPage(index + 1);

        const content = await page.getTextContent();

        return content.items
          .map((item: TextItem | TextMarkedContent) =>
            'str' in item ? item.str : '',
          )
          .join(' ');
      },
    );

    const pageTexts = await Promise.all(pagePromises);

    return pageTexts.join('\n').trim();
  }
}
