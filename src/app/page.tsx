import Link from "next/link";
import {
  Heart,
  Mic,
  FileText,
  Pill,
  Activity,
  Brain,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary-600" />
            <span className="font-bold text-lg text-surface-900">CardioPront</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#funcionalidades" className="text-sm text-surface-600 hover:text-surface-900">
              Funcionalidades
            </Link>
            <Link href="#como-funciona" className="text-sm text-surface-600 hover:text-surface-900">
              Como funciona
            </Link>
            <Link href="#precos" className="text-sm text-surface-600 hover:text-surface-900">
              Preços
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost">
              Entrar
            </Link>
            <Link href="/cadastro" className="btn-primary">
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6">
          <Activity className="w-4 h-4" />
          Feito exclusivamente para cardiologistas
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-surface-900 leading-tight tracking-tight max-w-4xl mx-auto">
          O prontuário que
          <span className="text-primary-600"> entende de coração</span>
        </h1>
        <p className="mt-6 text-xl text-surface-600 max-w-2xl mx-auto leading-relaxed">
          Transcrição por voz, pedidos de exames cardiológicos, prescrição inteligente e
          síntese automática de consultas — tudo em um só lugar. Sem cartão de crédito.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/cadastro" className="btn-primary text-base px-8 py-3 h-12">
            Começar grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="#como-funciona" className="btn-secondary text-base px-8 py-3 h-12">
            Ver como funciona
          </Link>
        </div>
        <p className="mt-4 text-sm text-surface-400">
          Sem cartão de crédito · Migração gratuita · Suporte 24h
        </p>
      </section>

      {/* Social Proof */}
      <section className="bg-surface-50 py-12 border-y border-surface-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-surface-500 mb-6">
            Recursos pensados para a realidade do cardiologista brasileiro
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-surface-900">25+</div>
              <div className="text-sm text-surface-500">Exames cardiológicos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-surface-900">30+</div>
              <div className="text-sm text-surface-500">Medicamentos no catálogo</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-surface-900">6</div>
              <div className="text-sm text-surface-500">Escores cardiovasculares</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-surface-900">100%</div>
              <div className="text-sm text-surface-500">LGPD compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-900">
            Tudo o que sua clínica precisa
          </h2>
          <p className="mt-4 text-lg text-surface-600 max-w-2xl mx-auto">
            Substitua papel, PDFs e sistemas genéricos por um prontuário feito sob medida para cardiologia.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Mic className="w-6 h-6" />}
            title="Transcrição por voz"
            description="Grave a consulta e a IA transcreve em tempo real, treinada em vocabulário médico cardiológico brasileiro."
          />
          <FeatureCard
            icon={<FileText className="w-6 h-6" />}
            title="Pedidos de exames"
            description="Builder com 25+ exames cardiológicos: ECG, Eco, Holter, MAPA, AngioTC e mais. Imprima ou envie."
          />
          <FeatureCard
            icon={<Pill className="w-6 h-6" />}
            title="Prescrição inteligente"
            description="Catálogo de 30+ medicamentos cardiovasculares com alertas de interação e ajuste por função renal."
          />
          <FeatureCard
            icon={<Brain className="w-6 h-6" />}
            title="Síntese por IA"
            description="A IA resume cada consulta: motivo, achados, exames pedidos, conduta e sinais de alerta."
          />
          <FeatureCard
            icon={<Activity className="w-6 h-6" />}
            title="Timeline cardiovascular"
            description="Acompanhe a evolução do paciente: FE ao longo do tempo, eventos, medicamentos e resultados."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Segurança & LGPD"
            description="Criptografia ponta a ponta, servidores no Brasil, assinatura digital ICP-Brasil."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="bg-surface-50 py-24 border-y border-surface-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900">
              Comece em 3 passos
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Step number={1} title="Cadastre-se grátis" description="Sem cartão de crédito. Comece a usar em menos de 1 minuto." />
            <Step number={2} title="Cadastre seus pacientes" description="Preencha anamnese cardiovascular, comorbidades e medicamentos." />
            <Step number={3} title="Faça sua primeira consulta" description="Grave, peça exames, prescreva. A IA faz o resto por você." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-900">
            Preços simples, sem surpresas
          </h2>
          <p className="mt-4 text-lg text-surface-600">
            Cresça no seu ritmo. Cancele quando quiser.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <PricingCard
            name="Trial"
            price="R$ 0"
            period="/para sempre"
            description="Para testar"
            features={[
              "Até 10 pacientes",
              "Prontuário básico",
              "Pedidos de exames",
              "Sem cartão de crédito",
            ]}
            cta="Começar grátis"
            secondary
          />
          <PricingCard
            name="Profissional"
            price="R$ 199"
            period="/mês"
            description="Para consultórios"
            features={[
              "Pacientes ilimitados",
              "Transcrição por voz + IA",
              "Prescrição inteligente",
              "Síntese automática",
              "Scores cardiovasculares",
              "Suporte prioritário",
            ]}
            cta="Começar agora"
            featured
          />
          <PricingCard
            name="Clínica"
            price="R$ 499"
            period="/mês"
            description="Para clínicas"
            features={[
              "Múltiplos médicos",
              "Business Intelligence",
              "API para laboratórios",
              "Dashboard gerencial",
              "Suporte dedicado",
            ]}
            cta="Falar com vendas"
            secondary
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface-50 py-24 border-y border-surface-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-surface-900 text-center mb-12">
            Perguntas frequentes
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="O sistema é específico para cardiologia?"
              answer="Sim! O CardioPront foi construído do zero para cardiologistas. Temos templates de anamnese cardiovascular, catálogo de exames cardiológicos, banco de medicamentos cardíacos e escores como CHA₂DS₂-VASc e Framingham."
            />
            <FAQItem
              question="A transcrição por voz funciona com sotaque?"
              answer="Sim. Nossa integração usa o Whisper da OpenAI com fine-tuning para vocabulário médico brasileiro, incluindo termos cardiológicos em português."
            />
            <FAQItem
              question="Meus dados estão seguros?"
              answer="Totalmente. Servidores no Brasil, criptografia AES-256, conformidade com LGPD e CFM 1.821/2007. Assinatura digital ICP-Brasil em todos os documentos."
            />
            <FAQItem
              question="Posso migrar de outro sistema?"
              answer="Sim. Nossa equipe faz a migração gratuita dos seus pacientes e histórico. Entre em contato e fazemos em até 3 dias."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
          Pronto para transformar sua consulta?
        </h2>
        <p className="text-lg text-surface-600 mb-8 max-w-xl mx-auto">
          Junte-se a centenas de cardiologistas que já economizam horas por semana.
        </p>
        <Link href="/cadastro" className="btn-primary text-base px-8 py-3 h-12">
          Começar grátis agora
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary-600" />
              <span className="font-bold text-surface-900">CardioPront</span>
            </div>
            <p className="text-sm text-surface-500">
              © 2026 CardioPront · Feito em São Paulo · Conforme LGPD
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-surface-500 hover:text-surface-900">
                Privacidade
              </Link>
              <Link href="#" className="text-sm text-surface-500 hover:text-surface-900">
                Termos
              </Link>
              <Link href="#" className="text-sm text-surface-500 hover:text-surface-900">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-hover">
      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-600">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  featured,
  secondary,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  secondary?: boolean;
}) {
  return (
    <div
      className={`card ${
        featured
          ? "border-primary-600 ring-2 ring-primary-100"
          : "border-surface-200"
      }`}
    >
      {featured && (
        <span className="badge-blue mb-4">Mais popular</span>
      )}
      <h3 className="text-xl font-bold text-surface-900">{name}</h3>
      <p className="text-sm text-surface-500 mt-1">{description}</p>
      <div className="mt-4 mb-6">
        <span className="text-4xl font-bold text-surface-900">{price}</span>
        <span className="text-surface-500">{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-surface-700">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/cadastro"
        className={featured ? "btn-primary w-full" : "btn-secondary w-full"}
      >
        {cta}
      </Link>
    </div>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="card">
      <h3 className="font-semibold text-surface-900 mb-2">{question}</h3>
      <p className="text-surface-600 text-sm leading-relaxed">{answer}</p>
    </div>
  );
}
