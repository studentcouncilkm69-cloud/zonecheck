class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    render() {
        if (this.state.hasError) {
            return (
                <div className="h-[100dvh] bg-red-50 p-8 flex flex-col items-center justify-center text-center">
                    <i className="ph ph-warning-circle text-red-500 mb-4 text-6xl"></i>
                    <h1 className="text-3xl font-bold text-red-600 mb-2">⚠️ ระบบขัดข้อง</h1>
                    <p className="text-red-500 mb-4 text-sm font-medium">ตรวจพบข้อผิดพลาด หรืออินเทอร์เน็ตไม่เสถียร<br/>กรุณากดปุ่มด้านล่างเพื่อเริ่มใหม่</p>
                    <button onClick={() => {
                        safeRemoveItem('zc26_rooms'); safeRemoveItem('zc26_inspectors');
                        safeRemoveItem('zc26_inspections'); safeRemoveItem('zc26_settings');
                        safeSessionRemove('zc26_active_session');
                        window.location.reload();
                    }} className="mt-6 px-6 py-3 bg-[#C8102E] text-white font-medium rounded-xl shadow-lg">รีเซ็ตและโหลดใหม่</button>
                </div>
            );
        }
        return this.props.children;
    }
}
