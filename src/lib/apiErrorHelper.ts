// API 응답 에러 분류 헬퍼.
// 404 / 5xx → 신 staging 엔드포인트가 아직 준비 안 됐거나 백엔드 일시 장애 →
//   FE 폴백 UI를 "준비 중" 톤으로 노출.
// 그 외 → 진짜 오류 → "오류" 톤으로 노출.

export class ApiError extends Error {
    readonly status: number;
    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export const isApiPendingStatus = (status: number): boolean =>
    status === 404 || (status >= 500 && status < 600);

export type EndpointPendingMode = 'preparing' | 'empty' | 'error';

export const getEndpointPendingMode = (error: unknown): EndpointPendingMode => {
    if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as { status: unknown }).status;
        if (typeof status === 'number') {
            return isApiPendingStatus(status) ? 'preparing' : 'error';
        }
    }
    // status 정보 없는 일반 Error → 일단 "준비 중"으로 부드럽게 폴백
    return 'preparing';
};

export const throwIfNotOk = async (response: Response, endpointLabel: string): Promise<Response> => {
    if (response.ok) return response;
    let message = `${endpointLabel} 응답이 ${response.status} 입니다.`;
    try {
        const body = await response.clone().json();
        if (body && typeof body === 'object' && 'detail' in body && typeof body.detail === 'string') {
            message = body.detail;
        }
    } catch {
        // 응답 본문이 JSON 아니면 기본 메시지 유지
    }
    throw new ApiError(response.status, message);
};
