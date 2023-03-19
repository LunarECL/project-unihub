import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ManagementService {
  constructor() {}

  /**
   * @see https://auth0.com/docs/secure/tokens/access-tokens/get-management-api-access-tokens-for-production#get-access-tokens
   */
  private async getManagementAPIAccessToken() {
    const options = {
      method: 'POST',
      url: process.env.AUTH0_ISSUER_URL + 'oauth/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
        client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
      }),
    };
    const response = await axios(options);
    return response.data;
  }

  async getIdpAccessToken(userId: string) {
    const url = process.env.AUTH0_AUDIENCE + 'users/' + userId;
    const accessToken = await this.getManagementAPIAccessToken();
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
      },
    });

    return response;
  }
}
