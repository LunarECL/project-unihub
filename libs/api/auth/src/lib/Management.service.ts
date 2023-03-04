import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map, mergeMap } from 'rxjs';

@Injectable()
export class ManagementService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * @see https://auth0.com/docs/secure/tokens/access-tokens/get-management-api-access-tokens-for-production#get-access-tokens
   */
  private getManagementAPIAccessToken() {
    const options = {
      method: 'POST',
      url: process.env.AUTH0_ISSUER_URL + 'oauth/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_ID,
        audience: process.env.AUTH0_AUDIENCE,
      }),
    };

    return this.httpService.request(options);
  }

  getIdpAccessToken(userId: string) {
    const url = process.env.AUTH0_AUDIENCE + 'users/' + userId;

    const req = this.getManagementAPIAccessToken().pipe(
      map((res) => res.data.access_token),
      mergeMap((accessToken) =>
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ),
      map((res) => ({
        accessToken: res.data.identities[0].access_token as string,
      }))
    );

    return firstValueFrom(req);
  }
}
