import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
import { processImage } from '../../lib/server-image-processor'
import formidable from 'formidable'

// Disable the default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}

export default withIronSessionApiRoute(async function resizeRoute(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  // Parse the multipart form data
  const form = new formidable.IncomingForm()
  
  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    // Get the uploaded image file
    const imageFile = files.image
    
    if (!imageFile) {
      return res.status(400).json({ message: 'No image file provided' })
    }
    
    // Read the file buffer
    const imageBuffer = await new Promise((resolve, reject) => {
      const fs = require('fs')
      fs.readFile(imageFile.filepath, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })

    // Process the image
    const result = await processImage(imageBuffer, {
      width: parseInt(fields.width, 10),
      height: parseInt(fields.height, 10),
      format: fields.format,
      maintainAspectRatio: fields.maintainAspectRatio === 'true',
      quality: 90
    })

    // Set the appropriate content type
    const contentTypes = {
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp'
    }
    
    res.setHeader('Content-Type', contentTypes[result.info.format] || 'image/jpeg')
    res.setHeader('Content-Disposition', `attachment; filename="resized.${result.info.format}"`)
    
    // Send the processed image
    res.send(result.buffer)
  } catch (error) {
    console.error('Error resizing image:', error)
    res.status(500).json({ message: 'Failed to resize image' })
  }
}, sessionOptions)