import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';

interface VisitorEntry {
  visitorId: string;
  date: string;
  companyName: string;
  visitorName: string;
  address: string;
  idProof: string;
  idNo: string;
  mobileNo: string;
  meetTo: string;
  department: string;
  noOfVisitors: number;
  purpose: string;
  inTime: string;
  outTime: string;
  photo: string;
}

@Component({
  selector: 'app-visitor-gate-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitor-gate-entry.component.html',
  styleUrls: ['./visitor-gate-entry.component.css']
})
export class VisitorGateEntryComponent {

  visitor: VisitorEntry = this.getEmptyVisitor();

  visitorList: VisitorEntry[] = [];
  currentPass: VisitorEntry | null = null;

  photoPreview = '';
  searchText = '';

  idProofOptions = [
    'PAN Card',
    'Aadhar Card',
    'Driving Licence',
    'Voter ID',
    'Company ID',
    'Others'
  ];

  purposeOptions = ['Official', 'Personal'];

  private readonly storageKey = 'visitorEntries';
  private readonly logoPath = 'assets/global-medikit-logo.png';

  constructor() {
    this.loadVisitors();
  }

  getEmptyVisitor(): VisitorEntry {
    return {
      visitorId: '',
      date: new Date().toISOString().substring(0, 10),
      companyName: '',
      visitorName: '',
      address: '',
      idProof: 'Aadhar Card',
      idNo: '',
      mobileNo: '',
      meetTo: '',
      department: '',
      noOfVisitors: 1,
      purpose: 'Official',
      inTime: new Date().toTimeString().substring(0, 5),
      outTime: '',
      photo: ''
    };
  }

  loadVisitors(): void {
    try {
      this.visitorList = JSON.parse(
        localStorage.getItem(this.storageKey) || '[]'
      );
    } catch {
      this.visitorList = [];
    }
  }

  saveToStorage(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.visitorList)
    );
  }

  get filteredVisitors(): VisitorEntry[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.visitorList;
    }

    return this.visitorList.filter(v =>
      (v.visitorId || '').toLowerCase().includes(search) ||
      (v.visitorName || '').toLowerCase().includes(search) ||
      (v.companyName || '').toLowerCase().includes(search) ||
      (v.mobileNo || '').includes(search)
    );
  }

  private generateVisitorId(): string {
    const year = new Date().getFullYear();

    const existingNumbers = this.visitorList
      .map(v => {
        const match = (v.visitorId || '').match(
          new RegExp(`^GML-${year}-(\\d+)$`)
        );
        return match ? Number(match[1]) : 0;
      });

    const nextNumber = Math.max(0, ...existingNumbers) + 1;

    return `GML-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Please upload a JPG or PNG image.');
      input.value = '';
      return;
    }

    // Keep uploaded photos reasonably small for browser storage.
    if (file.size > 3 * 1024 * 1024) {
      alert('Please select a photo smaller than 3 MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.visitor.photo = this.photoPreview;
    };

    reader.readAsDataURL(file);
  }

  async saveVisitor(): Promise<void> {
    if (
      !this.visitor.date ||
      !this.visitor.companyName.trim() ||
      !this.visitor.visitorName.trim() ||
      !this.visitor.mobileNo.trim() ||
      !this.visitor.meetTo.trim()
    ) {
      alert(
        'Please fill Date, Company Name, Visitor Name, Mobile No. and Meet To Person Name.'
      );
      return;
    }

    const newEntry: VisitorEntry = {
      ...this.visitor,
      visitorId: this.generateVisitorId(),
      noOfVisitors: Math.max(1, Number(this.visitor.noOfVisitors) || 1)
    };

    this.visitorList.unshift(newEntry);

    try {
      this.saveToStorage();
    } catch {
      this.visitorList.shift();
      alert(
        'Unable to save this visitor. The photo may be too large for browser storage.'
      );
      return;
    }

    this.currentPass = { ...newEntry };

    await this.downloadPassPdf(newEntry);

    this.resetForm();
  }

  resetForm(): void {
    this.visitor = this.getEmptyVisitor();
    this.photoPreview = '';
  }

  updateOutTime(v: VisitorEntry): void {
    v.outTime = new Date().toTimeString().substring(0, 5);
    this.saveToStorage();

    if (this.currentPass?.visitorId === v.visitorId) {
      this.currentPass = { ...v };
    }
  }

  downloadExistingPass(v: VisitorEntry): void {
    this.currentPass = { ...v };
    this.downloadPassPdf(v);
  }

  closePass(): void {
    this.currentPass = null;
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  private getImageFormat(dataUrl: string): 'PNG' | 'JPEG' {
    return dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
  }

  private drawPhotoPlaceholder(
    doc: jsPDF,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    doc.setFillColor(242, 245, 248);
    doc.roundedRect(x, y, w, h, 1, 1, 'F');

    doc.setFillColor(174, 187, 200);
    doc.circle(x + w / 2, y + 9, 4.2, 'F');

    doc.ellipse(
      x + w / 2,
      y + 19,
      7,
      5.5,
      'F'
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(90, 100, 110);
    doc.text('VISITOR PHOTO', x + w / 2, y + h - 2, {
      align: 'center'
    });
  }

  private drawDetailRow(
    doc: jsPDF,
    label: string,
    value: string,
    x: number,
    y: number,
    rowHeight: number
  ): void {
    const totalWidth = 90;
    const labelWidth = 31;

    doc.setDrawColor(170, 180, 190);
    doc.setLineWidth(0.2);

    doc.rect(x, y, totalWidth, rowHeight);
    doc.line(
      x + labelWidth,
      y,
      x + labelWidth,
      y + rowHeight
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.7);
    doc.setTextColor(45, 55, 65);

    doc.text(label, x + 1.5, y + rowHeight / 2 + 1.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(30, 30, 30);

    const textLines = doc.splitTextToSize(
      value || '-',
      totalWidth - labelWidth - 4
    );

    const lines = textLines.slice(0, 2);
    const lineHeight = 2.6;
    const textHeight = lines.length * lineHeight;
    const textY = y + (rowHeight - textHeight) / 2 + 2;

    doc.text(lines, x + labelWidth + 2, textY);
  }

  async downloadPassPdf(v: VisitorEntry): Promise<void> {

    // Compact visitor pass: 100 mm x 150 mm (approximately 4 x 6 inches)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150]
    });

    const pageWidth = 100;
    const left = 5;
    const right = 95;

    // Outer pass border
    doc.setDrawColor(40, 60, 80);
    doc.setLineWidth(0.55);
    doc.roundedRect(3, 3, 94, 144, 1.5, 1.5);

    // Company logo
    try {
      const logoImage = await this.loadImage(this.logoPath);

      const canvas = document.createElement('canvas');
      canvas.width = logoImage.naturalWidth;
      canvas.height = logoImage.naturalHeight;

      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(logoImage, 0, 0);
        const logoData = canvas.toDataURL('image/png');

        doc.addImage(logoData, 'PNG', 5, 5, 19, 14);
      }
    } catch {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(24, 59, 99);
      doc.text('GML', 14.5, 13, { align: 'center' });
    }

    // Company heading
    doc.setTextColor(24, 59, 99);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('GLOBAL MEDIKIT LIMITED', 61, 9, {
      align: 'center'
    });

    doc.setTextColor(55, 55, 55);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.1);
    doc.text(
      'KHASRA NO.- 323 [MI], CENTRAL HOPE TOWN',
      61,
      14,
      { align: 'center' }
    );
    doc.text(
      'CAMP ROAD, DEHRADUN UK 248197',
      61,
      17.5,
      { align: 'center' }
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(24, 59, 99);
    doc.text('GML VISITOR MANAGEMENT SYSTEM', 61, 22, {
      align: 'center'
    });

    doc.setDrawColor(24, 59, 99);
    doc.setLineWidth(0.45);
    doc.line(left, 25, right, 25);

    // Pass title
    doc.setFillColor(24, 59, 99);
    doc.roundedRect(5, 27, 90, 7, 1, 1, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('VISITOR GATE PASS', pageWidth / 2, 31.8, {
      align: 'center'
    });

    // Visitor ID and date
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.8);

    doc.text(`Visitor ID: ${v.visitorId}`, 6, 39);
    doc.text(`Date: ${v.date}`, 94, 39, { align: 'right' });

    // Summary block and photo
    const summaryX = 5;
    const summaryY = 42;
    const summaryWidth = 64;
    const summaryRowHeight = 7;

    const summaryRows: [string, string][] = [
      ['Company', v.companyName],
      ['Visitor Name', v.visitorName],
      ['Mobile No.', v.mobileNo]
    ];

    summaryRows.forEach((row, index) => {
      const y = summaryY + index * summaryRowHeight;

      doc.setDrawColor(180, 190, 200);
      doc.rect(summaryX, y, summaryWidth, summaryRowHeight);

      doc.setFillColor(241, 244, 247);
      doc.rect(summaryX, y, 22, summaryRowHeight, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.setTextColor(45, 55, 65);
      doc.text(row[0], summaryX + 1.3, y + 4.4);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.7);
      doc.setTextColor(30, 30, 30);

      const valueLines = doc.splitTextToSize(row[1] || '-', 39);
      doc.text(valueLines[0], summaryX + 23.5, y + 4.4);
    });

    // Visitor photo frame
    const photoX = 74;
    const photoY = 42;
    const photoW = 21;
    const photoH = 27;

    doc.setDrawColor(100, 115, 130);
    doc.setLineWidth(0.4);
    doc.roundedRect(photoX, photoY, photoW, photoH, 1, 1);

    if (v.photo) {
      try {
        doc.addImage(
          v.photo,
          this.getImageFormat(v.photo),
          photoX + 0.7,
          photoY + 0.7,
          photoW - 1.4,
          photoH - 1.4
        );
      } catch {
        this.drawPhotoPlaceholder(
          doc,
          photoX + 0.7,
          photoY + 0.7,
          photoW - 1.4,
          photoH - 1.4
        );
      }
    } else {
      this.drawPhotoPlaceholder(
        doc,
        photoX + 0.7,
        photoY + 0.7,
        photoW - 1.4,
        photoH - 1.4
      );
    }

    // Detail rows
    let y = 65;

    const detailRows: [string, string, number][] = [
      ['Address', v.address, 9],
      ['ID Proof', v.idProof, 6.2],
      ['ID No.', v.idNo, 6.2],
      ['Meet To Person', v.meetTo, 6.5],
      ['Deptt. Name', v.department, 6.2],
      ['No. of Visitor', String(v.noOfVisitors || 1), 6.2],
      ['Purpose', v.purpose, 6.2],
      ['In Time', v.inTime, 6.2],
      ['Out Time', v.outTime || '____________', 6.2]
    ];

    detailRows.forEach(([label, value, height]) => {
      this.drawDetailRow(
        doc,
        label,
        value,
        5,
        y,
        height
      );

      y += height;
    });

    // Signatures
    const signatureY = 129;

    doc.setDrawColor(80, 80, 80);
    doc.setLineWidth(0.25);

    doc.line(8, signatureY, 43, signatureY);
    doc.line(57, signatureY, 92, signatureY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.2);
    doc.setTextColor(40, 40, 40);

    doc.text('Visitor Signature', 25.5, signatureY + 3.5, {
      align: 'center'
    });

    doc.text('Security Guard', 74.5, signatureY + 3.5, {
      align: 'center'
    });

    doc.text('Signature', 74.5, signatureY + 6.5, {
      align: 'center'
    });

        
    doc.save(`${v.visitorId}.pdf`);
  }
}