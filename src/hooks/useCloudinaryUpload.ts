import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

async function uploadImageToCloudinary(file: File): Promise<string> {
  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', 'afro-rave')

  try {
    const res = await axios.post('https://api.cloudinary.com/v1_1/dyufpxzbz/image/upload', data)
    console.log(res.data.secure_url)
    return res.data.secure_url
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    throw err
  }
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (data: File) => uploadImageToCloudinary(data),
    onError: (error) => {
      console.error('Failed to upload image', error)
      toast.error('Failed to upload image. Please try again.')
    },
  })
}
