export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'bill' | 'recharge';
  label: string;
  sub: string;
  amount: number;
  date: string;
  time: string;
}

export const txList: Transaction[] = [
  { id: '1', type: 'received', label: 'Money Received', sub: 'From Rafiq Ahmed • 017×××8921', amount: 1500, date: '28 Sep', time: '10:30 AM' },
  { id: '2', type: 'sent',     label: 'Money Sent',     sub: 'To Karim Traders • 018×××4532', amount: -250, date: '27 Sep', time: '3:15 PM' },
  { id: '3', type: 'bill',     label: 'DESCO Electricity', sub: 'Meter No: 1122334455',       amount: -890, date: '25 Sep', time: '11:00 AM' },
  { id: '4', type: 'recharge', label: 'Mobile Recharge', sub: '017×××7890',                   amount: -100, date: '24 Sep', time: '9:45 AM' },
  { id: '5', type: 'received', label: 'Money Received', sub: 'From Nasrin Akter • 019×××2341', amount: 3000, date: '22 Sep', time: '2:00 PM' },
  { id: '6', type: 'sent',     label: 'Money Sent',     sub: 'To Rahim Mia • 016×××5678',     amount: -500, date: '20 Sep', time: '4:30 PM' },
];

export const savedContacts = [
  { name: 'Rafiq Ahmed', number: '01798889921' },
  { name: 'Nasrin Akter', number: '01912345678' },
  { name: 'Rahim Mia',   number: '01645678901' },
  { name: 'Fatema Begum', number: '01812345678' },
];

export const BALANCE = 12450.75;
export const ACCOUNT_NUM = '0178 888 9999';
export const ACCOUNT_NAME = 'Mohammad Ali';
