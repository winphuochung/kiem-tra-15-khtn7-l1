/**
 * Mã nguồn Backend Google Apps Script (KHTN 7 - Kiểm tra 15 phút)
 * Cột lưu trữ trên Google Sheets:
 * [Thời gian | Họ tên | Lớp | Mã đề | Điểm | Số câu đúng | Số lần vi phạm | Ghi chú]
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Tự động tạo dòng tiêu đề nếu trang tính đang trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời gian",
        "Họ tên",
        "Lớp",
        "Mã đề",
        "Điểm",
        "Số câu đúng",
        "Số lần vi phạm",
        "Ghi chú"
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold");
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("vi-VN"),
      data.name || "",
      data.className || "",
      data.examCode || "",
      Number(data.score) || 0,
      data.correctCount || "",
      data.violations || 0,
      data.note || ""
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Đã ghi điểm thành công!" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
