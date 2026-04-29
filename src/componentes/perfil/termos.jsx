import React from "react";
import "./termos.css";

export default function ModalTermos({ abrir, fechar, aceitar }) {

    if (!abrir) return null;

    return (
        <div className="modal-termos-overlay">

            <div className="modal-termos-card">

                <h2 className="modal-termos-titulo">
                    Termos de Uso
                </h2>

                <div className="modal-termos-texto">

                    <h3>1. Sobre a Plataforma</h3>
                    <p>
                        A MissioNetwork é uma plataforma digital voltada à interação social entre usuários por meio de conteúdos,
                        comunicação e conexões, baseada em valores éticos, respeito e princípios religiosos.
                    </p>
                    <p>
                        A plataforma não é afiliada, administrada ou oficialmente vinculada à A Igreja de Jesus Cristo dos Santos dos Últimos Dias.
                    </p>

                    <h3>2. Cadastro e Conta</h3>
                    <p>O cadastro na plataforma é gratuito.</p>
                    <p>Para criar uma conta, é obrigatório fornecer:</p>
                    <ul>
                        <li>Nome</li>
                        <li>Email</li>
                        <li>Senha</li>
                    </ul>

                    <p>Para publicar conteúdo, o perfil deve conter:</p>
                    <ul>
                        <li>Ala</li>
                        <li>Estaca</li>
                        <li>Bispo</li>
                        <li>Chamado</li>
                        <li>Foto de perfil</li>
                        <li>Foto de capa</li>
                    </ul>

                    <p>O usuário é responsável por manter suas informações corretas e seguras.</p>

                    <h3>3. Uso por Menores de Idade</h3>
                    <p>
                        Usuários menores de 18 anos poderão utilizar a plataforma somente com autorização de seus responsáveis legais.
                    </p>

                    <h3>4. Regras de Uso</h3>

                    <p>É proibido:</p>

                    <ul>
                        <li>Discurso de ódio</li>
                        <li>Conteúdo adulto ou impróprio</li>
                        <li>Informações falsas</li>
                        <li>Spam ou comportamento abusivo</li>
                        <li>Desrespeito a outros usuários ou aos valores da plataforma</li>
                    </ul>

                    <p>
                        Conteúdos que violem estas regras poderão ser denunciados por outros usuários
                        de forma anônima por meio do sistema interno da plataforma.
                    </p>

                    <p>
                        As denúncias são confidenciais e não revelam a identidade de quem denunciou.
                        Todas as denúncias passam por análise da MissioNetwork antes da aplicação
                        de qualquer penalidade.
                    </p>

                    <h3>5. Publicações e Conteúdo</h3>
                    <ul>
                        <li>Usuários podem postar texto, imagem e vídeo</li>
                        <li>Conteúdo pode ser removido a qualquer momento, quando necessário</li>
                        <li>Existe sistema de denúncia</li>
                    </ul>
                    <p>
                        A MissioNetwork não garante a veracidade dos conteúdos publicados.
                    </p>

                    <h3>6. Sistema de Denúncias</h3>

                    <p>
                        A MissioNetwork possui um sistema de denúncias para manter a qualidade,
                        segurança e respeito dentro da plataforma.
                    </p>

                    <p>
                        Cada usuário possui um limite de 20 pontos de reputação. Esses pontos podem
                        ser reduzidos conforme denúncias recebidas e analisadas.
                    </p>

                    <p>As penalidades são aplicadas da seguinte forma:</p>

                    <ul>
                        <li>Leve: -2 pontos</li>
                        <li>Média: -4 pontos</li>
                        <li>Grave: -7 pontos</li>
                        <li>Gravíssima: -20 pontos (banimento imediato)</li>
                    </ul>

                    <p>
                        As denúncias passam por análise interna da plataforma antes de qualquer
                        penalidade ser aplicada. Denúncias abusivas, falsas ou feitas com intenção
                        de prejudicar outros usuários poderão ser desconsideradas.
                    </p>

                    <p>
                        Caso o usuário atinja o limite de penalidade ou cometa uma infração grave,
                        sua conta poderá ser suspensa ou encerrada permanentemente.
                    </p>

                    <p>
                        A decisão final sobre denúncias, penalidades e remoções é de responsabilidade
                        exclusiva da MissioNetwork.
                    </p>

                    <h3>7. Responsabilidade</h3>
                    <p>
                        O usuário é responsável por tudo que publica. A plataforma não se responsabiliza por conteúdos de terceiros.
                    </p>

                    <h3>8. Limitação</h3>
                    <ul>
                        <li>Conteúdos publicados por usuários</li>
                        <li>Interações dentro da plataforma</li>
                        <li>Decisões tomadas com base no conteúdo</li>
                        <li>Danos decorrentes do uso</li>
                    </ul>

                    <h3>9. Produtos (Futuro)</h3>
                    <p>
                        Poderão existir vendas de produtos para missionários, com entrega feita por terceiros.
                    </p>

                    <h3>10. Dados</h3>
                    <ul>
                        <li>Coleta apenas dados básicos</li>
                        <li>Não compartilha dados atualmente</li>
                        <li>Mudanças serão informadas</li>
                    </ul>

                    <h3>11. Alterações</h3>
                    <p>
                        Os termos podem ser atualizados, sendo necessário aceitar novamente.
                    </p>

                    <h3>12. Conta</h3>
                    <ul>
                        <li>Pode ser suspensa ou encerrada</li>
                        <li>Por violação dos termos ou denúncias</li>
                    </ul>

                    <h3>13. Legislação</h3>
                    <p>Regido pelas leis do Brasil.</p>

                    <h3>14. Aceitação</h3>
                    <p>
                        Ao utilizar a plataforma, o usuário declara que leu e concorda com os termos.
                    </p>

                </div>

                <button
                    className="modal-termos-btn-aceitar"
                    onClick={aceitar}
                >
                    Aceitar termos
                </button>

                <button
                    className="modal-termos-btn-fechar"
                    onClick={fechar}
                >
                    Cancelar
                </button>

            </div>

        </div>
    );
}