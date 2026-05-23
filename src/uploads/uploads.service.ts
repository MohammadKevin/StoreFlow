import {
  BadRequestException,
  Injectable,
} from '@nestjs/common'

import { v2 as cloudinary } from 'cloudinary'

import { UploadApiResponse } from 'cloudinary'

@Injectable()
export class UploadsService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'storeflow',
  ) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    const base64 = file.buffer.toString('base64')

    const dataUri = `data:${file.mimetype};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'image',
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  }

  async uploadImages(
    files: Express.Multer.File[],
    folder = 'storeflow',
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required')
    }

    const uploads = await Promise.all(
      files.map(async (file) => {
        return this.uploadImage(file, folder)
      }),
    )

    return uploads
  }

  async deleteImage(publicId: string) {
    if (!publicId) {
      throw new BadRequestException('Public ID is required')
    }

    const result = await cloudinary.uploader.destroy(publicId)

    return result
  }

  async uploadQr(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('QR image is required')
    }

    const base64 = file.buffer.toString('base64')

    const dataUri = `data:${file.mimetype};base64,${base64}`

    return cloudinary.uploader.upload(dataUri, {
      folder: 'storeflow/qris',
      resource_type: 'image',
    })
  }

  async uploadProductImage(
    file: Express.Multer.File,
  ) {
    return this.uploadImage(
      file,
      'storeflow/products',
    )
  }

  async uploadStoreLogo(
    file: Express.Multer.File,
  ) {
    return this.uploadImage(
      file,
      'storeflow/stores',
    )
  }
}