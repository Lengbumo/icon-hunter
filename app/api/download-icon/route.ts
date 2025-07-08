import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { iconUrl, appName, trackId, size } = body;

    if (!iconUrl || !appName || !trackId) {
      return NextResponse.json(
        { error: '缺少必要参数: iconUrl, appName, trackId' },
        { status: 400 }
      );
    }

    // 创建下载目录
    const downloadDir = join(process.cwd(), 'public', 'downloaded-icons');
    if (!existsSync(downloadDir)) {
      await mkdir(downloadDir, { recursive: true });
    }

    // 下载图标
    const response = await fetch(iconUrl);
    if (!response.ok) {
      throw new Error(`下载图标失败: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 生成文件名
    const fileExtension = iconUrl.includes('.png') ? 'png' : 'jpg';
    const fileName = `${appName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}_${trackId}_${size || 'default'}.${fileExtension}`;
    const filePath = join(downloadDir, fileName);

    // 保存文件
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      fileName,
      filePath: `/downloaded-icons/${fileName}`,
      message: `图标已成功下载: ${fileName}`,
    });

  } catch (error) {
    console.error('下载图标时出错:', error);
    return NextResponse.json(
      { error: '下载图标失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const downloadDir = join(process.cwd(), 'public', 'downloaded-icons');
    
    if (!existsSync(downloadDir)) {
      return NextResponse.json({
        files: [],
        count: 0,
        message: '尚未下载任何图标'
      });
    }

    const fs = await import('fs/promises');
    const files = await fs.readdir(downloadDir);
    
    const iconFiles = files
      .filter(file => file.endsWith('.png') || file.endsWith('.jpg'))
      .map(file => ({
        name: file,
        url: `/downloaded-icons/${file}`
      }));

    return NextResponse.json({
      files: iconFiles,
      count: iconFiles.length,
      message: `找到 ${iconFiles.length} 个已下载的图标`
    });

  } catch (error) {
    console.error('获取下载列表时出错:', error);
    return NextResponse.json(
      { error: '获取下载列表失败' },
      { status: 500 }
    );
  }
} 