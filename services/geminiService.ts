import { GoogleGenAI, Type } from "@google/genai";
import { Lead, CompanyProfile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// This schema is now only for reference in the prompt, not for API enforcement.
const leadGenerationSchemaDescription = `
[
  {
    "report": {
      "companyName": "O nome da empresa do lead.",
      "businessSector": "O ramo de atividade da empresa.",
      "keyContact": "Uma pessoa de contato chave, como 'Head de Marketing' ou 'CEO'.",
      "contactNumber": "O número de telefone principal, extraído DIRETAMENTE do perfil do Google Maps. Se não houver, deixe em branco.",
      "companyWebsite": "O website oficial da empresa, extraído EXATAMENTE como aparece no perfil do Google Maps. Se não houver website no perfil, deixe este campo em branco.",
      "digitalStatus": "Uma breve análise da presença digital do lead, ex: 'Usa chatbot básico no site' ou 'Alto engajamento no Instagram'.",
      "emailContact": "O e-mail de contato público, SOMENTE se estiver visível e listado no perfil do Google Maps. Se não existir, deixe este campo em branco. NÃO INVENTE."
    },
    "email": "O texto completo do e-mail de prospecção, hiperpersonalizado para o lead."
  }
]
`;

const getEmailApproachInstructions = (profile: CompanyProfile): string => {
  switch (profile.emailApproach) {
    case 'aggressive':
      return `
**Tom do E-mail:** Agressivo e direto.
**Diretriz:** Crie um senso de urgência ou FOMO (Fear Of Missing Out). Comece com uma afirmação forte que aponte uma dor ou perda. Exemplo: "Você está perdendo vendas por não fazer X..." ou "Seu concorrente está fazendo Y, e você?". O objetivo é chocar e provocar uma resposta rápida.
`;
    case 'friendly':
      return `
**Tom do E--mail:** Amigável e casual.
**Diretriz:** Construa um rapport. Use uma linguagem mais pessoal e menos corporativa. Pode mencionar algo que você observou no "Status Digital" deles de forma genuína. O objetivo é iniciar uma conversa, não vender agressivamente. Exemplo: "Olá [Nome], vi seu post sobre Z e achei muito interessante...".
`;
    case 'professional':
      return `
**Tom do E-mail:** Profissional e focado em valor.
**Diretriz:** Seja formal, mas conciso. Vá direto ao ponto sobre o valor que a sua "Solução Principal" pode agregar ao negócio do lead. Use dados ou uma proposta de valor clara. O objetivo é estabelecer credibilidade e agendar uma reunião baseada em benefícios de negócio.
`;
    case 'custom':
      return `
**Tom do E-mail:** Personalizado pelo usuário.
**Diretriz:** Siga EXATAMENTE as instruções abaixo para criar o e-mail:
"${profile.customEmailPrompt}"
`;
    default:
      return '';
  }
}


const generateDynamicPrompt = (profile: CompanyProfile): string => {
  let socialProfilesInfo = '';
  if (profile.linkedinProfile) {
    socialProfilesInfo += `\n* **Perfil no LinkedIn:** ${profile.linkedinProfile}`;
  }
  if (profile.twitterProfile) {
    socialProfilesInfo += `\n* **Perfil no Twitter (X):** ${profile.twitterProfile}`;
  }

  const emailInstructions = getEmailApproachInstructions(profile);

  return `
Você é um Agente de IA especialista em prospecção B2B, focado em PRECISÃO ABSOLUTA de dados.

**REGRAS INQUEBRÁVEIS:**
1.  **FONTE ÚNICA DE DADOS:** Sua ÚNICA fonte de informação de contato (website, telefone, email) DEVE ser o resultado da busca no Google Maps.
2.  **NÃO INVENTE NADA:** É expressamente PROIBIDO inventar, adivinhar, ou criar qualquer informação. Se o dado (ex: website ou e-mail) não estiver CLARAMENTE listado no perfil da empresa no Google Maps, o campo correspondente no JSON DEVE ser uma string vazia "".
3.  **A PRECISÃO É TUDO:** Um campo em branco é INFINITAMENTE melhor do que um dado falso. Sua performance é medida pela veracidade dos dados, não pela quantidade de campos preenchidos.

**Perfil da Empresa Contratante:**
* **Setor de Atuação:** ${profile.sector}
* **Porte/Tamanho:** ${profile.size}
* **Solução Principal:** ${profile.coreSolution}
* **Canais de Interação Principais:** ${profile.channels}${socialProfilesInfo}

**Critérios de Prospecção (ICP - Ideal Customer Profile):**
* **Perfil de Cliente Ideal (Descrição):** ${profile.icp}
* **País de Foco:** ${profile.country}. **REQUERIMENTO CRÍTICO:** Todos os leads DEVEM ser deste país. Os números de telefone devem corresponder ao código de discagem (DDI) deste país.
${profile.targetAudience ? `* **Público Específico (Foco Adicional):** Encontre empresas que correspondam a esta descrição: "${profile.targetAudience}".` : ''}

**Sua Tarefa:**
1.  **Use a Busca do Google Maps:** Para encontrar 10 empresas que se encaixam PERFEITAMENTE em TODOS os critérios de prospecção, use a ferramenta de busca do Google Maps como sua fonte primária e ÚNICA para dados de contato.
2.  **Crie um Relatório (COM DADOS REAIS):** Para cada empresa encontrada, preencha o relatório seguindo as REGRAS INQUEBRÁVEIS. A precisão do website, telefone e e-mail é crucial. Se não encontrar o dado no perfil do Google Maps, deixe o campo como uma string vazia "".
3.  **Escreva um E-mail Hiperpersonalizado:** Para cada lead, escreva um e-mail de prospecção seguindo as diretrizes abaixo. O e-mail deve:
    * Ser curto, direto e relevante.
    * Conectar a "Solução Principal" da empresa contratante com uma necessidade ou dor específica do lead.
    * Mencionar o "Status Digital" do lead de forma inteligente para mostrar que você fez sua pesquisa.
    * Ter uma chamada para ação (CTA) clara, sugerindo uma breve conversa focada em resultados.

**Diretrizes para o E-mail de Prospecção:**
${emailInstructions}

**Formato da Resposta:**
Gere a resposta EXATAMENTE no formato de um array JSON, sem nenhum texto adicional antes ou depois do array. Siga a estrutura abaixo:
${leadGenerationSchemaDescription}
`;
}

export const findLeads = async (profile: CompanyProfile): Promise<Lead[]> => {
  try {
    const prompt = generateDynamicPrompt(profile);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      tools: [{googleMaps: {}}],
    });
    
    let jsonText = response.text.trim();
    
    // Clean potential markdown formatting
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.substring(7);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.substring(0, jsonText.length - 3);
    }
    
    const leads = JSON.parse(jsonText);

    if (!Array.isArray(leads)) {
        throw new Error("AI response is not a valid list of leads.");
    }

    return leads;

  } catch (error) {
    console.error("Error generating leads:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to communicate with the Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating leads.");
  }
};