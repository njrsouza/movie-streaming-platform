Feature: Gerenciamento de Filmes no Catálogo
  As an administrador da plataforma de streaming
  I want to gerenciar os filmes do catálogo (cadastrar, editar e remover)
  So that os usuários tenham conteúdo atualizado para assistir

  Scenario: Cadastro de um novo filme com sucesso
    Given que eu estou autenticado como administrador
    And eu estou na página de catálogo de filmes
    When eu adiciono o filme "O Auto da Compadecida" com sinopse "A saga de João Grilo" e duração "104 minutos"
    Then eu vejo o filme "O Auto da Compadecida" no catálogo
    And eu vejo que este filme possui a sinopse "A saga de João Grilo"

 Scenario: Tentativa de cadastro sem campos obrigatórios
    Given que eu estou autenticado como administrador
    And eu estou na página de adicionar novo filme
    When eu tento adicionar um filme deixando o título em branco e com sinopse "Um filme qualquer"
    Then eu vejo a mensagem de erro "O título é obrigatório"
    And eu continuo na página de adicionar novo filme