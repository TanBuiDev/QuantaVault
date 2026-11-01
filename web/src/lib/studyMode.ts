/** Build-time capability flag. Local workspace remains the default. */
export function isStaticStudy(): boolean {
  return process.env.NEXT_PUBLIC_STUDY_MODE === "static";
}

export const STATIC_JUDGE_MESSAGE = "Bản website hỗ trợ đọc bài và lưu code cá nhân. Chấm Java trực tuyến sẽ được triển khai sau; hiện bạn có thể chạy bằng Docker trên máy cá nhân.";
