import config from "../config";
import { AppError } from "../utility/AppError";
import httpstatus from "http-status";
import { redisClient } from "./redis";

export const getBkashIdToken = async () => {
	try {
		const idTokenKey = "bkash:idToken";
		const refreshTokenKey = "bkash:refreshToken";
		const bkashIdtoken = await redisClient.get(idTokenKey);
		const bkashIdtokenTTL = await redisClient.ttl(idTokenKey);
		const bkashRefreshToken = await redisClient.get(refreshTokenKey);
		const bkashRefreshTokenTTL = await redisClient.ttl(refreshTokenKey);

		if (
			(bkashIdtokenTTL >= 600 || !bkashIdtoken) &&
			bkashRefreshToken &&
			bkashRefreshTokenTTL >= 600
		) {
			const response = await fetch(
				`${config.bkash_base_url}//tokenized/checkout/token/refresh`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						username: config.bkash_username,
						password: config.bkash_password,
					},
					body: JSON.stringify({
						app_key: config.bkash_app_key,
						app_secret: config.bkash_app_secret,
						refresh_token: bkashRefreshToken,
					}),
				},
			);
			if (!response.ok) {
				throw new AppError(
					httpstatus.UNAUTHORIZED,
					"bKash token refresh failed!",
				);
			}

			const result = await response.json();

			if (result.id_token) {
				await redisClient.set(idTokenKey, result.id_token, { EX: 24 * 24 });
				return result.id_token;
			}
		}
		if (bkashIdtokenTTL >= 600) {
			return bkashIdtoken;
		}
		const response = await fetch(
			`${config.bkash_base_url}//tokenized/checkout/token/grant`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					username: config.bkash_username,
					password: config.bkash_password,
				},
				body: JSON.stringify({
					app_key: config.bkash_app_key,
					app_secret: config.bkash_app_secret,
				}),
			},
		);

		if (!response.ok) {
			throw new AppError(
				httpstatus.BAD_REQUEST,
				"bKash access token grant failed!",
			);
		}
		const result = await response.json();
		await redisClient.set(idTokenKey, result.id_token, {
			EX: 60 * 60, //1 hour
		});
		await redisClient.set(refreshTokenKey, result.refresh_token, {
			EX: 60 * 60 * 24 * 28, //28 day
		});
		return result.id_token;
	} catch (error: any) {
		throw new AppError(
			error.statusCode || httpstatus.INTERNAL_SERVER_ERROR,
			error.message || "Something went wrong with bKash Authentication",
		);
	}
};
