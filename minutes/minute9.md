# Minuta 9 – 29/10/2024 18:00h 
 
## Iteração 2.
 
### Participantes: 
- Rodrigo Abreu 
- Eduardo Lopes 
- Tomás Brás 
- Hugo Ribeiro 
 
### Temas discutidos:
- Alterações na arquitetura
- Introdução de novos endpoints
- Ajustes no backlog
 
### Resumo: 
Na arquitetura adicionámos um novo serviço, Notification Service. Por lapso, esquecemo-nos de implementar serviço que lidasse com as notificações das alterações feitas pelo admin, como as notificações da meteorologia vindos da api externa.
Adicionámos endpoints, para o System Controller e para o Notification Service. Ainda não temos aqui os endpoints relacionados com a filtragem, porque ainda não sabemos muito bem como incluí-los aqui. 
Além disto, fizemos bastantes ajustes no backlog, desde a remoção de tasks que já não eram relevantes tendo em conta as novas aprendizagens em relação ao projeto, como a adição de novos issues e a distribuição do trabalho desta iteração.
Ainda não implementámos nada, pois queriamos tirar umas duvidas com o professor para assegurar que estamos a ir na direção certa.


### Tabelas de Endpoints (atualizado):


#### Authentication Controller, `/api/v1/auth`

| Method | Path               | Description                                     |
|--------|--------------------|--------------------------------------------------|
| Post    | /login           | Realizar a autenticação do user com base no email e na password            |
| Post    | /createAccount           | criar uma conta                           |

#### Flight Service, `/api/v1/flight`

| Method | Path                    | Description                                              |
|--------|------------------------|----------------------------------------------------------|
| Post   | /add                   | Adicionar um voo.                                       |
| Get    | /all                   | Obter a lista de voos.                                  |
| Get    | /all?date=<date>      | Obter a lista de voos filtrados por data.               |
| Get    | /{id}                  | Obter um voo pelo id.                                   |
| Put    | /{id}                  | Atualizar voo pelo id.                                  |
| Delete | /{id}                  | Eliminar voo pelo id.                                   |
| Get    | /{id}/pilots           | Obter pilotos de um voo pelo id do voo.                 |
| Get    | /{id}/attendants       | Obter os hospedeiros de bordo de um voo pelo id do voo. |
| Get    | /{id}/plane            | Obter avião de um voo pelo id.                          |
| Get    | /{id}/depart_city      | Obter id da cidade de partida do voo.                   |
| Get    | /{id}/arrival_city     | Obter id da cidade destino do voo.                      |
| Put    | /{id}/{pilot_id}       | Trocar piloto de um voo pelo id do voo e pelo id do piloto. |
| Put    | /{id}/{attendant_id}   | Trocar hospedeiro de bordo de um voo pelo id do voo e pelo id do hospedeiro. |

#### Staff Service, `/api/v1/staff`

| Method | Path                        | Description                                               |
|--------|-----------------------------|-------------------------------------------------------------|
| Post   | /add                       | Adicionar empregado.                                     |
| Get    | /all                       | Obter todos os empregados.                                |
| Get    | /all?role=<role_name>     | Obter todos os empregados de uma certa função.           |
| Put    | /{id}                      | Atualizar informações de um empregado pelo id.           |
| Delete | /{id}                      | Eliminar um empregado pelo id.                           |
| Get    | /{id}/flights              | Obter voos de um empregado pelo id.                      |
| Get    | /{id}/flights/{flight_id}  | Obter um certo voo de um empregado pelo id.              |

#### Plane Service, `/api/v1/plane`

| Method | Path        | Description                                   |
|--------|---------------|-------------------------------------------------|
| Post   | /add       | Adicionar um avião.                          |
| Delete | /{id}      | Remover avião pelo id.                       |
| Get    | /{id}/flights | Obter os voos associados ao avião pelo id. |
| Get    | /all       | Obter todos os aviões.                       |

#### Weather Service, `/api/v1/weather`

| Method | Path               | Description                                     |
|--------|--------------------|--------------------------------------------------|
| Post   | /add              | Adicionar cidade (coordenadas).                 |
| Put    | /{id}             | Atualizar informações de cidade.                 |
| Get    | /{id}/coord       | Obter as coordenadas de uma cidade pelo id.     |
| Get    | /{id}/weather     | Obter as condições meteorológicas pelo id da cidade. |


#### Notification Service, `/api/v1/notification`

| Method | Path               | Description                                     |
|--------|--------------------|--------------------------------------------------|
| Put    | /{notification_id} | Atualizar uma notificação como lida através do id |
| Get    | /all/{user_id}       | Obter todas as notificações de um utilizador    |



> Feito por: Rodrigo Abreu (Team Manager) 
