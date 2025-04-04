import {uploadImage} from '@/lib/uploadFile';
import {createToken, findTokenByTicker, findTokenList} from '@/services/token';
import { BOND_ABI, FACTORY_ABI, FACTORY_ADDRESS, TOKEN_ABI } from '@/util/coin/constant';
import { ethers, formatEther } from 'ethers';
import { NextResponse } from 'next/server';

export const getTokenMarket = async (tokenInfo) => {
  try {
    const {address, bondAddress} = tokenInfo || {};
    if (address && bondAddress) {
      const jsonProvider = new ethers.JsonRpcProvider(process.env.OKX_HTTP_PROVIDER);
      const bondFactory = new ethers.Contract(bondAddress, BOND_ABI, jsonProvider);
      const price = await bondFactory.getPrice();
      const tokenFactory = new ethers.Contract(address, TOKEN_ABI, jsonProvider);
      const totalSupply = await tokenFactory.totalSupply();
      const formattedCap = formatEther(totalSupply) * formatEther(price);
      return formattedCap;
    }
  } catch {
    return null;
  }
};

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const pageNo = searchParams.get('pageNo') || 1;
  const keyword = searchParams.get('keyword') || '';
  const decodeKeyword = decodeURIComponent(keyword);
  const address = searchParams.get('address') || '';
  try {
    const [total, tokens] = await findTokenList({pageNo, keyword: decodeKeyword, address});
    const formattedTokens = await Promise.all(tokens.map(async (token) => {
      const marketCap = await getTokenMarket(token);
      return {
        ...token,
        marketCap
      };
    }));
    if (tokens) {
      return NextResponse.json({
        total,
        data: formattedTokens
      });
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(null);
  }
}

export async function PUT(req) {
  const formData = await req.formData();

  const data = {};
  formData.forEach((value, key) => {
    if (key !== 'image') {
      data[key] = value;
    }
  });

  const image = formData.get('image');

  if (!data.userId || !data.name || !data.ticker || !image || !data.description) {
    return NextResponse.json({ message: 'Data formatter error!'}, { status: 400 });
  }

  const isExist = await findTokenByTicker(data.ticker);
  if (isExist) {
    return NextResponse.json({ message: 'Token already exists!' }, { status: 400 });
  }

  const tokenAddress = data.address;
  if (!tokenAddress) {
    return NextResponse.json({ message: 'Token address is required!' }, { status: 400 });
  }

  const provider = new ethers.JsonRpcProvider(process.env.OKX_HTTP_PROVIDER);
  const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

  const tokenInfo = await factoryContract.getTokenInfo(tokenAddress);

  const infoLength = tokenInfo?.length;

  const bondAddress = tokenInfo?.[infoLength - 1];

  data.bondAddress = bondAddress;

  const imageUrl = await uploadImage(`${process.env.TOKEN_LOGO}/${data.ticker}`, image);
  if (imageUrl.error) {
    // return NextResponse.json({ message: imageUrl.error.message || 'Image upload failed!' }, { status: 500 });
    data.image = '';
  } else {
    data.image = JSON.stringify(imageUrl.data);
  }


  try {
    const newToken = await createToken(data);
    console.log('newToken:', newToken);
    return NextResponse.json(newToken);
  } catch (error) {
    console.log(error);
    return NextResponse.json(null);
  }
}
