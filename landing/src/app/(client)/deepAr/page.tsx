import DeepARComponent from './DeepAr';

export default function Home() {
  return (
    <div>
      <h1>DeepAR Integration with Next.js</h1>
      {/* Pass your DeepAR license key */}
      <DeepARComponent licenseKey="cd25e7d0d50ebe986744f79d258dcb160a33ba48237901f54aa9976f0023ad0db0a29e1437c1bf35" />
    </div>
  );
}
