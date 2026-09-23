import { Endpoints } from '../../../shared/constants/api.constants'
import apiClient from '../../../shared/services/api.client'
import type { UserDTO } from '../../auth/types/auth.types'

/**
 * Upload an avatar image for current user.
 */
export async function uploadAvatar(imageUri: string): Promise<UserDTO> {
  const formData = new FormData()

  const filename = imageUri.split('/').pop() || 'avatar.jpg'
  const match = /\.(\w+)$/.exec(filename)
  const type = match
    ? `image/${match[1].toLowerCase() === 'jpg' ? 'jpeg' : match[1].toLowerCase()}`
    : 'image/jpeg'

  formData.append('file', {
    uri: imageUri,
    name: filename,
    type,
  } as any)

  const response = await apiClient.post<UserDTO>(
    Endpoints.USERS_ME_AVATAR,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  return response.data
}

/**
 * Delete avatar for current user.
 */
export async function deleteAvatar(): Promise<UserDTO> {
  const response = await apiClient.delete<UserDTO>(Endpoints.USERS_ME_AVATAR)
  return response.data
}

/**
 * Get current user profile.
 */
export async function getMyProfile(): Promise<UserDTO> {
  const response = await apiClient.get<UserDTO>(Endpoints.USERS_ME)
  return response.data
}

export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  bio?: string
}

/**
 * Update current user profile.
 */
export async function updateProfile(
  data: UpdateProfilePayload,
): Promise<UserDTO> {
  const response = await apiClient.put<UserDTO>(Endpoints.USERS_ME, data)
  return response.data
}
