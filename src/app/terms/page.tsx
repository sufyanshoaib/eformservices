import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { auth } from "@/auth";

export default async function TermsPage() {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    return (
        <div className="min-h-screen bg-white">
            <Header isLoggedIn={isLoggedIn} />
            <main className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
                <article className="prose prose-slate max-w-none hover:prose-a:text-blue-600">
                    <h1>Terms of Service</h1>
                    <p className="lead text-xl text-slate-600">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <p>
                        Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) carefully before using the eformly website (the &quot;Service&quot;) operated by eformly (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
                    </p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                    </p>

                    <h2>2. Description of Service</h2>
                    <p>
                        eformly provides tools to convert PDF documents into fillable web forms. You understand and agree that the Service is provided &quot;AS-IS&quot; and that eformly assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.
                    </p>

                    <h2>3. User Accounts</h2>
                    <p>
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>

                    <h2>4. Content Liability</h2>
                    <p>
                        Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material (&quot;Content&quot;). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                    </p>

                    <h2>5. NO WARRANTY</h2>
                    <p className="uppercase font-bold">
                        THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. EFORMLY EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.
                    </p>
                    <p className="uppercase font-bold">
                        EFORMLY MAKES NO WARRANTY THAT (I) THE SERVICE WILL MEET YOUR REQUIREMENTS, (II) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, (III) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE, OR (IV) THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR OBTAINED BY YOU THROUGH THE SERVICE WILL MEET YOUR EXPECTATIONS.
                    </p>

                    <h2>6. LIMITATION OF LIABILITY</h2>
                    <p className="uppercase font-bold">
                        IN NO EVENT SHALL EFORMLY, NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (III) ANY CONTENT OBTAINED FROM THE SERVICE; AND (IV) UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.
                    </p>
                    <p className="uppercase font-bold">
                        YOU SPECIFICALLY ACKNOWLEDGE THAT EFORMLY SHALL NOT BE LIABLE FOR USER CONTENT OR THE DEFAMATORY, OFFENSIVE, OR ILLEGAL CONDUCT OF ANY THIRD PARTY AND THAT THE RISK OF HARM OR DAMAGE FROM THE FOREGOING RESTS ENTIRELY WITH YOU.
                    </p>

                    <h2>7. Changes</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>

                    <h2>8. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at legal@eformly.com.
                    </p>
                </article>
            </main>
            <Footer />
        </div>
    );
}
