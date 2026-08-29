import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Beyond3000
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          اكتب مقالاتك الطويلة<br />
          <span className="text-blue-600">وشاركها مع العالم</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          لينكدان يحدك بـ 3000 حرف؟ أنشئ حسابك واكتب مقالاتك بدون قيود.
          احصل على رابط جميل وشاركه مع متابعيك.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition text-lg"
          >
            ابدأ الآن — مجاناً
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-xl transition text-lg"
          >
            لدي حساب
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-3xl mb-4">✍️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">كتابة حرة</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              اكتب بدون حدود للأحرف. مقالاتك تبقى ملكك بالكامل.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">رابط جميل</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              كل مقالة لها رابط فريد: yourname.com/username/article-slug
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">متوافق مع لينكدان</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              عند مشاركة الرابط على لينكدان، يظهر preview احترافي.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
