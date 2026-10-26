// Cấu hình ngân hàng nhận thanh toán VietQR (Client & Server safe)
export const BANK_CONFIG = {
  bankId: 'MB', // Quân Đội (MBBank)
  accountNo: '0988776655',
  accountName: 'CONG TY LMS VIET NAM',
  template: 'compact2',
};

/**
 * Sinh chuỗi link mã VietQR động chuẩn NAPAS 247
 */
export function generateVietQrUrl(amount: number, description: string): string {
  const encodedDesc = encodeURIComponent(description);
  return `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-${BANK_CONFIG.template}.png?amount=${amount}&addInfo=${encodedDesc}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;
}
