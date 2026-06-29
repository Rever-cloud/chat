export default function FuturisticBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020207]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-95"
        style={{ backgroundImage: "url('/reverse-ai-bg.png')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.88)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/70" />
    </div>
  );
}
