import axios from 'axios'

export async function getAuthID () {
  try {
    const { data } = await axios.get(PROJECT_ROOT + '/api/authentication/auth') // eslint-disable-line
    if (data.success) {
      return {
        success: true,
        auth_id: data.auth_id
      }
    }
    throw new Error('Could not fetch `auth_id`')
  } catch (e) {
    return {
      success: false,
      error: JSON.stringify(e)
    }
  }
}