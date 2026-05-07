الملفات الموجودة في مشروعك التي تخص تعديل أبعاد الصفحة الرئيسية:

1) src/sections/Hero.jsx
2) src/index.css

طريقة التنفيذ:
- انسخ فولدر scripts داخل root المشروع بجانب package.json.
- افتح PowerShell من فولدر المشروع.
- شغل:
  powershell -ExecutionPolicy Bypass -File .\scripts\apply-home-responsive-fix.ps1

السكريبت سيعدل الملفين الحقيقيين:
- src/sections/Hero.jsx
- src/index.css

وسيعمل backup قبل التعديل:
- src/sections/Hero.jsx.bak
- src/index.css.bak

ملاحظة:
ملف portfolio.rar المرفوع لا يمكن فك ضغطه بالكامل داخل البيئة الحالية، لكن تم قراءة أسماء الملفات داخله، والملف الصحيح للـ Home section هو src/sections/Hero.jsx وليس Home.jsx.
