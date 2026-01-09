import OTPForm from "./OTPForm";

export default async function VerifyPage({
    searchParams,
}: {
    searchParams: { email?: string };
}) {

    const { email } = await searchParams;
    console.log(email)
    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <OTPForm email={email || ""} />
        </main>
    );
}
