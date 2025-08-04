# 📦 Scripts Directory

این پوشه شامل اسکریپت‌های مفید برای مدیریت پروژه است.

## 🚀 publish.sh

اسکریپت خودکار برای publish کردن پکیج به npm.

### نحوه استفاده:

```bash
# روش 1: استفاده از npm script
npm run publish:package

# روش 2: اجرای مستقیم
./scripts/publish.sh
```

### مراحل اسکریپت:

1. **بررسی branch**: اطمینان از اینکه روی master هستیم
2. **بررسی تغییرات**: اطمینان از commit شدن همه تغییرات
3. **Build**: اجرای `yarn build`
4. **تست پکیج**: اجرای `npm pack --dry-run`
5. **Version bump**: انتخاب نوع bump (patch/minor/major/custom)
6. **Commit**: commit کردن تغییرات version
7. **Tag**: ایجاد git tag
8. **Publish**: publish کردن به npm
9. **Push**: push کردن به git
10. **GitHub Pages**: آپدیت کردن demo page

### انواع Version Bump:

- **patch**: 1.0.2 -> 1.0.3 (bug fixes)
- **minor**: 1.0.2 -> 1.1.0 (new features)
- **major**: 1.0.2 -> 2.0.0 (breaking changes)
- **custom**: ورود version دلخواه

### نکات مهم:

- قبل از اجرا مطمئن شوید که npm login کرده‌اید
- همه تغییرات باید commit شده باشند
- باید روی master branch باشید
- اسکریپت به صورت خودکار GitHub Pages رو آپدیت می‌کنه

---

**نکته:** این اسکریپت تمام مراحل publish رو به صورت خودکار انجام می‌ده! 🚀 