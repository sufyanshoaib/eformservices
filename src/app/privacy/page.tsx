import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { auth } from "@/auth";

export default async function PrivacyPage() {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    return (
        <div className="min-h-screen bg-white">
            <Header isLoggedIn={isLoggedIn} />
            <main className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
                <article className="prose prose-slate max-w-none hover:prose-a:text-blue-600">
                    <h1>Privacy Policy</h1>
                    <p className="lead text-xl text-slate-600">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <p>
                        eformly (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) operates the eformly website (the &quot;Service&quot;). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                    </p>

                    <h2>1. Information Collection</h2>
                    <p>
                        We collect several different types of information for various purposes to provide and improve our Service to you.
                    </p>
                    <h3>Personal Data</h3>
                    <p>
                        While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (&quot;Personal Data&quot;). This may include, but is not limited to:
                    </p>
                    <ul>
                        <li>Email address</li>
                        <li>First name and last name</li>
                        <li>Cookies and Usage Data</li>
                    </ul>

                    <h3>Document Data</h3>
                    <p>
                        We process the PDF documents you upload and the data submitted via your forms (&quot;Document Data&quot;). We store this data to facilitate the service. We do not inspect the content of your PDFs unless required by law or for support purposes at your request.
                    </p>

                    <h3>Signature Data</h3>
                    <p>
                        For security and privacy, <strong>we do not permanently store full biometric signature data in our primary database</strong>. Signatures captured during form submission are used to generate the final signed document and are sanitized from our records immediately after processing. The final signed PDF document may be stored on our secure servers to allow you to download it.
                    </p>

                    <h2>2. Use of Data</h2>
                    <p>
                        eformly uses the collected data for various purposes:
                    </p>
                    <ul>
                        <li>To provide and maintain the Service</li>
                        <li>To notify you about changes to our Service</li>
                        <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                        <li>To provide customer care and support</li>
                        <li>To provide analysis or valuable information so that we can improve the Service</li>
                        <li>To monitor the usage of the Service</li>
                        <li>To detect, prevent and address technical issues</li>
                    </ul>

                    <h2>3. Data Security</h2>
                    <p>
                        The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                    </p>

                    <h2>4. Service Providers</h2>
                    <p>
                        We may employ third party companies and individuals to facilitate our Service (&quot;Service Providers&quot;), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                    </p>

                    <h2>5. Changes to This Privacy Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                    </p>

                    <h2>6. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at legal@eformly.com.
                    </p>
                </article>
            </main>
            <Footer />
        </div>
    );
}
