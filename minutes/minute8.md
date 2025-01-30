# Minuta 8 – 26/10/2024 22:30h 
 
## Iteração 2.
 
### Participantes: 
- Rodrigo Abreu 
- Eduardo Lopes 
- Tomás Brás 
- Hugo Ribeiro 
 
### Temas discutidos:
- Definição de endpoints
 
### Resumo: 

Foram definidos endpoints entre o grupo, mas não ficou concluído. Surgiram algumas dúvidas que vão ser esclarecidas na aula de quinta-feira.
Achámos importante estipular bem as coisas antes de proceder à implementação e divisão de tarefas.

### Endpoints:

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



> Feito por: Rodrigo Abreu (Team Manager) 
