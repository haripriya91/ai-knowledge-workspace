import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upload-source',
  standalone: true,
  templateUrl: './upload-source.component.html',
  styleUrl: './upload-source.component.css'
})
export class UploadSourceComponent {

  @Output() upload = new EventEmitter<{
    file?: File;
    url?: string;
    name?: string;
  }>();

  file: File | null = null;
  url = '';
  name = '';
  error = '';

  onNameChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.name = input.value;
  }

  onUrlChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.url = input.value;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.error = 'Only PDF and DOCX files are allowed';
      this.file = null;
      return;
    }

    this.file = file;
    this.error = '';
  }

  submit() {
    if (!this.file && !this.url) {
      this.error = 'Provide file or URL';
      return;
    }

    this.upload.emit({
      file: this.file || undefined,
      url: this.url || undefined,
      name: this.name || undefined
    });
  }
}