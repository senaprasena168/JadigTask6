import LoginCard from '../../components/LoginCard/LoginCard'; // Adjust path based on your exact file system

export const metadata = {
  title: 'PetStore Login',
  description: 'Login to your PetStore account',
};

export default function LoginPage() {
  return (
    <main>
      <LoginCard />
    </main>
  );
}