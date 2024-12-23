import moment from 'moment';
import querystring from 'qs';
import crypto from 'crypto';

function sortObject(obj) {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}
export async function POST(req: Request, res: Response) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  const body = await req.json();
  const date = new Date();
  const userId = body.userId;
  const createDate = moment(date).format('YYYYMMDDHHmmss');

  const ipAddr = req.headers.get('x-forwarded-for');

  //   return new Response(JSON.stringify({ ipAddr }));

  const tmnCode = '4EUNAMQY';
  const secretKey = 'ZMEPVCKRZCHVRJPASGLESYRTUCFLGXGQ';
  let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  const returnUrl = process.env.NEXT_PUBLIC_SITE_URL + '/api/vnpay/checkout';
  const orderId = moment(date).format('DDHHmmss');
  const amount = parseInt(body.total) * 100;
  const bankCode = 'NCB';

  const checkedItems = JSON.stringify(body.checkedItems);
  const userFullName = body.userFullName;
  const userEmail = body.userEmail;
  const userAddress = body.userAddress;
  const uuid = body.uuid;

  const locale = 'vn';
  const currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['uuid'] = uuid;
  vnp_Params['userFullName'] = userFullName;
  vnp_Params['userEmail'] = userEmail;
  vnp_Params['userAddress'] = userAddress;
  vnp_Params['checkedItems'] = checkedItems;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  return new Response(JSON.stringify({ vnpUrl }));
}

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);
  let vnp_Params = querystring.parse(searchParams.toString());
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  const tmnCode = '4EUNAMQY';
  const secretKey = 'ZMEPVCKRZCHVRJPASGLESYRTUCFLGXGQ';

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

    return new Response(JSON.stringify('success'));
  } else {
    return new Response(JSON.stringify('error'));
  }
}
