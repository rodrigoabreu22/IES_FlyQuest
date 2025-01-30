## Tabela de endpoints

- Authorization Controller -> /api/v1/auth

| Método | Endpoint               | Descrição                                              |
|--------|-------------------------|--------------------------------------------------------|
| POST   | `/api/v1/auth/login`    | Realizar a autenticação do usuário com base no email e na senha. |
| POST   | `/api/v1/auth/createAccount` | Criar uma conta.                                     |

- CityWeather Controller -> /api/v1/weather

| Método | Endpoint                     | Descrição                                           |
|--------|-------------------------------|-----------------------------------------------------|
| POST   | `/api/v1/weather/add`         | Adicionar uma cidade (coordenadas).                 |
| PUT    | `/api/v1/weather/{cityname}`  | Atualizar informações de uma cidade.                |
| GET    | `/api/v1/weather/{cityname}`  | Obter condições meteorológicas pelo nome da cidade. |

- Flight Controller -> /api/v1/flight

| Método | Endpoint                                    | Descrição                                                       |
|--------|---------------------------------------------|-----------------------------------------------------------------|
| POST   | `/api/v1/flight/add`                        | Adicionar um voo.                                               |
| GET    | `/api/v1/flight/all`                        | Obter a lista de voos.                                          |
| GET    | `/api/v1/flight/{id}`                       | Obter um voo pelo ID.                                           |
| PUT    | `/api/v1/flight/{id}`                       | Atualizar voo pelo ID.                                          |
| PUT    | `/api/v1/flight/{id}/cancel`                | Cancelar um voo pelo ID.                                        |
| GET    | `/api/v1/flight/{id}/pilots`                | Obter pilotos de um voo pelo ID do voo.                         |
| GET    | `/api/v1/flight/{id}/attendants`            | Obter hospedeiros de bordo de um voo pelo ID do voo.            |
| GET    | `/api/v1/flight/{id}/plane`                 | Obter avião de um voo pelo ID.                                  |
| GET    | `/api/v1/flight/{id}/departCity`            | Obter ID da cidade de partida do voo.                           |
| GET    | `/api/v1/flight/{id}/arrivalCity`           | Obter ID da cidade destino do voo.                              |
| PUT    | `/api/v1/flight/{id}/crew/{employee_id}`    | Trocar um empregado da equipe pelo ID do voo e do empregado a trocar. |
| GET    | `/api/v1/flight/{id}/seats`                 | Obter todos os lugares do avião de um voo pelo ID.              |
| GET    | `/api/v1/flight/{id}/seats?flightClass=<flight_class>` | Obter todos os lugares de uma classe.            |
| GET    | `/api/v1/flight/{id}/seats/available`       | Obter todos os lugares livres do voo.                           |
| PUT    | `/api/v1/flight/{id}/seat`                  | Atualizar o estado de um lugar num voo para reservado.          |
| GET    | `/api/v1/flight/{id}/seats/{flightClass}/occupied` | Obter os lugares ocupados de uma classe pelo ID do voo.  |

- Plane Controller -> api/v1/plane

| Método | Endpoint                      | Descrição                                           |
|--------|-------------------------------|-----------------------------------------------------|
| POST   | `/api/v1/plane`               | Adicionar um avião.                                 |
| GET    | `/api/v1/plane/{id}/flights`  | Obter os voos associados ao avião pelo ID.          |
| GET    | `/api/v1/plane/all`           | Obter todos os aviões.                              |

- Staff Controller -> api/v1/staff

| Método | Endpoint                                    | Descrição                                           |
|--------|---------------------------------------------|-----------------------------------------------------|
| POST   | `/api/v1/staff/add`                         | Adicionar um empregado.                             |
| GET    | `/api/v1/staff/all`                         | Obter todos os empregados.                          |
| GET    | `/api/v1/staff/all?role=<role_name>`        | Obter todos os empregados de uma certa função.      |
| PUT    | `/api/v1/staff/{id}`                        | Atualizar informações de um empregado pelo ID.      |
| GET    | `/api/v1/staff/{id}/flights`                | Obter voos de um empregado pelo ID.                 |

- Notification Controller -> api/v1/notification

| Método | Endpoint                                 | Descrição                                           |
|--------|------------------------------------------|-----------------------------------------------------|
| PUT    | `/api/v1/notification/{notification_id}` | Atualizar uma notificação como lida através do ID.  |
| GET    | `/api/v1/notification/all/{user_id}`     | Obter todas as notificações de um usuário.          |
| DELETE | `/api/v1/notification/{notification_id}` | Remover uma notificação pelo ID.                    | 
