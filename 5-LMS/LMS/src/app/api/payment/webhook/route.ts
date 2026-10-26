import { NextRequest, NextResponse } from 'next/server';
import { processSuccessfulPayment } from '@/lib/payment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const orderCode = body.orderCode || body.content || body.order_code;
    const amount = Number(body.amount || body.transferAmount || 0);
    const transactionId = body.transactionId || body.referenceCode || body.id || `TX_${Date.now()}`;
    const gateway = body.gateway || 'vietqr_sepay';

    if (!orderCode || !amount) {
      return NextResponse.json({ error: 'Dữ liệu webhook thiếu orderCode hoặc amount' }, { status: 400 });
    }

    const result = processSuccessfulPayment({
      orderCode: orderCode.trim(),
      transactionId: String(transactionId),
      gateway,
      paidAmount: amount,
      rawPayload: body,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi xử lý webhook thanh toán' }, { status: 400 });
  }
}
