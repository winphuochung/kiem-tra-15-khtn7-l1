/**
 * ============================================================================
 * MÃ NGUỒN GOOGLE APPS SCRIPT - KIỂM TRA 15 PHÚT KHTN 7 (BÀI 2, 3, 4, 5, 6)
 * ============================================================================
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Mở Google Sheets -> Tiện ích mở rộng (Extensions) -> Apps Script.
 * 2. Xóa mã mặc định và dán toàn bộ mã này vào -> Nhấn Lưu (Save).
 * 3. Nhấn Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment)
 *    - Loại: Ứng dụng web (Web app)
 *    - Thực thi dưới dạng (Execute as): Tôi (Me)
 *    - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
 * 4. Copy "URL ứng dụng web" (Web App URL) dán vào biến SCRIPT_URL trong index.html.
 */

// 1. Hàm kiểm tra kết nối khi truy cập trực tiếp URL trên trình duyệt
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "online",
      message: "Kết nối Google Apps Script (KHTN 7) đang hoạt động bình thường!"
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

// 2. Hàm nhận dữ liệu bài làm của học sinh từ trang web (index.html)
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Khóa luồng tối đa 10 giây để tránh xung đột khi cả lớp nộp bài cùng lúc
    lock.waitLock(10000);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Tự động khởi tạo tiêu đề cột nếu trang tính đang trống
    if (sheet.getLastRow() === 0) {
      setupHeader(sheet);
    }

    // Giải mã dữ liệu JSON gửi từ index.html
    var rawContent = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(rawContent);

    // Ghi một dòng kết quả mới vào Google Sheets
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("vi-VN"),
      data.name || "",
      data.className || "",
      data.examCode || "",
      Number(data.score) || 0,
      data.correctCount || "",
      Number(data.violations) || 0,
      data.note || ""
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Đã lưu điểm thành công!" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 3. Hàm định dạng dòng tiêu đề bảng điểm (có thể chạy thủ công hoặc tự động)
function setupHeader(sheet) {
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }
  var headers = [
    "Thời gian nộp",
    "Họ và tên học sinh",
    "Lớp",
    "Mã đề",
    "Điểm số (Thang 10)",
    "Số câu đúng",
    "Số lần vi phạm",
    "Ghi chú"
  ];
  sheet.appendRow(headers);

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#1e40af");
  headerRange.setFontColor("#ffffff");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}
