
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MaterialInward {
  srNo: number;
  transactionType: string;
  docType: string;
  date: string;
  partyName: string;
  senderAddress: string;
  challanInvoiceNo: string;
  challanInvoiceDate: string;
  deliveryPersonName: string;
  vehicleNo: string;
  materialDetails: string;
  quantity: string;
  qualityCondition: string;
  securityPersonName: string;
  receiverName: string;
  invoiceAmount: string;
  remarks: string;
  poNo: string;
}

@Component({
  selector: 'app-material-inward',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './material-inward.component.html',
  styleUrls: ['./material-inward.component.css']
})
export class MaterialInwardComponent {

  private readonly storageKey = 'materialInwardRecords';

  materialInward: MaterialInward = this.getEmptyForm();

  materialInwardList: MaterialInward[] = [];
  filteredDocList: any[] = [];
  FilteredItemRows: any[] = [];
  searchText = '';
  transactionTypeOptions = ['With PO', 'Without PO'];
  Supplier = [{'CardCode':'V0001','CardName':'A.K','CardType':'S'},{'CardCode':'V0002','CardName':'B.K','CardType':'S'},
  {'CardCode':'V0003','CardName':'C.K','CardType':'S'},
  {'CardCode':'V0004','CardName':'D.K','CardType':'S'},];
DocList = [
    { CardCode: "V0001", DocNum: 1, DocDate: 902232, DocTotal: 1000 },
    { CardCode: "V0001", DocNum: 2, DocDate: 902233, DocTotal: 2500 },
    { CardCode: "V0001", DocNum: 3, DocDate: 902234, DocTotal: 1800 },
    { CardCode: "V0001", DocNum: 4, DocDate: 902235, DocTotal: 3200 },
    { CardCode: "V0001", DocNum: 5, DocDate: 902236, DocTotal: 750 },
    { CardCode: "V0001", DocNum: 6, DocDate: 902237, DocTotal: 4100 },
    { CardCode: "V0001", DocNum: 7, DocDate: 902238, DocTotal: 1200 }
];

itemRows: any[] = [
  { DocNum: 1, ItemName: 'XLP65CC Drive 1545-M', ItemCode: 'XLP65CC Drive 1545-M', WhsCode: 'DR01', OpenQty: 100000, BalanceQty: 100000, ReceivingQty: null, Remarks: '', selected: false },
  { DocNum: 2, ItemName: 'Steel Rod 12mm',        ItemCode: 'SR-012',              WhsCode: 'DR01', OpenQty: 5000,   BalanceQty: 3500,   ReceivingQty: null, Remarks: '', selected: false },
  { DocNum: 3, ItemName: 'MS Plate 5mm',          ItemCode: 'MP-005',              WhsCode: 'DR02', OpenQty: 2500,   BalanceQty: 2500,   ReceivingQty: null, Remarks: '', selected: false },
  { DocNum: 4, ItemName: 'Welding Electrode 3.15',ItemCode: 'WE-315',              WhsCode: 'DR02', OpenQty: 800,    BalanceQty: 450,    ReceivingQty: null, Remarks: '', selected: false },
  { DocNum: 5, ItemName: 'Angle 50x50x5',         ItemCode: 'AN-5050',             WhsCode: 'DR03', OpenQty: 1200,   BalanceQty: 1200,   ReceivingQty: null, Remarks: '', selected: false },
  
];

  docTypeOptions = [
    'PURCHASE',
    'PANTRY ITEM',
    'RGP',
    'NRGP',
    'CASH',
    'CHALLAN',
    'IUT',
    'COURIER',
    'OTHERS'
  ];

  constructor() {
    this.loadRecords();
  }
  ngOnInit(): void {
    //alert('Material Inward Component Initialized');
  }
  getEmptyForm(): MaterialInward {
    return {
      srNo: 0,
      transactionType: 'With PO',
      docType: '',
      date: new Date().toISOString().substring(0, 10),
      partyName: '',
      senderAddress: '',
      challanInvoiceNo: '',
      challanInvoiceDate: '',
      deliveryPersonName: '',
      vehicleNo: '',
      materialDetails: '',
      quantity: '',
      qualityCondition: '',
      securityPersonName: '',
      receiverName: '',
      invoiceAmount: '',
      remarks: '',
      poNo: ''
    };
  }

  loadRecords(): void {
    try {
      this.materialInwardList = JSON.parse(
        localStorage.getItem(this.storageKey) || '[]'
      );
    } catch {
      this.materialInwardList = [];
    }
  }

  saveToStorage(): boolean {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.materialInwardList)
      );
      return true;
    } catch {
      alert('Unable to save records in browser storage.');
      return false;
    }
  }
  get filteredRecords(): MaterialInward[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.materialInwardList;
    }

    return this.materialInwardList.filter(item =>
      String(item.srNo).includes(search) ||
      item.transactionType.toLowerCase().includes(search) ||
      item.docType.toLowerCase().includes(search) ||
      item.partyName.toLowerCase().includes(search) ||
      item.challanInvoiceNo.toLowerCase().includes(search) ||
      item.vehicleNo.toLowerCase().includes(search) ||
      item.materialDetails.toLowerCase().includes(search) ||
      item.poNo.toLowerCase().includes(search)
    );
  }

  onTransactionTypeChange(): void {
    if (this.materialInward.transactionType === 'Without PO') {
      this.materialInward.poNo = '';
    }
  }

  saveMaterialInward(): void {

    if (
      !this.materialInward.date ||
      !this.materialInward.docType ||
      !this.materialInward.partyName.trim() ||
      !this.materialInward.securityPersonName.trim()
    ) {
      alert('Please fill Date, Doc Type, Party Name and Security Person Name.');
      return;
    }

    if (
      this.materialInward.transactionType === 'With PO' &&
      !this.materialInward.poNo.trim()
    ) {
      alert('Please enter PO Number for With PO transaction.');
      return;
    }

    const nextSrNo = this.materialInwardList.length > 0
      ? Math.max(...this.materialInwardList.map(item => item.srNo || 0)) + 1
      : 1;

    const newRecord: MaterialInward = {
      ...this.materialInward,
      srNo: nextSrNo
    };

    this.materialInwardList.unshift(newRecord);

    if (!this.saveToStorage()) {
      this.materialInwardList.shift();
      return;
    }

    alert('Material inward record saved successfully.');

    this.resetForm();
  }

  resetForm(): void {
    this.materialInward = this.getEmptyForm();
  }

  deleteRecord(item: MaterialInward): void {
    const confirmDelete = confirm(
      `Are you sure you want to delete record ${item.srNo}?`
    );

    if (!confirmDelete) {
      return;
    }

    const oldList = [...this.materialInwardList];

    this.materialInwardList = this.materialInwardList.filter(
      record => record !== item
    );

    if (!this.saveToStorage()) {
      this.materialInwardList = oldList;
    }
  }
GetDocNum(cardcode:any): void {
    this.filteredDocList = this.DocList.filter(
      supplier => supplier.CardCode === cardcode
    );
  }
  selectDoc(doc: any) {
    this.FilteredItemRows = this.itemRows.filter(
      x => x.DocNum === doc.DocNum
    );    
  }
}
