# Minuta 11 – 1/11/2024 23:00h 
 
## Iteração 2.
 
### Participantes: 
- Rodrigo Abreu 
- Eduardo Lopes 
- Hugo Ribeiro 
 
### Temas discutidos:
- Análise do ER das entidades
- Começar a implementação.
 
### Resumo: 
O Team Leader apresentou o ER em que esteve a trabalhar para tornar mais direta a implementação e discutiu com o devops e arquiteto, ajustes a fazer nele.
![image](https://github.com/user-attachments/assets/ad0cf589-25db-4d18-add7-3f7091f341ac)

Alguns ajustes foram feitos:
- a crew vai ter um número fixo de flight attendants (4) para ficar de acordo com o número normal de hospedeitos de bordo num avião de cerca de 120 lugares, como é o caso dos aviões da nossa companhia aérea.
- o city_weather vai ter também informação da latitude e longitude.
- remoção das relações extra-serviços, porque violam os princípios da nossa arquitetura, Microservices.


Fica aqui a indicação de como está agora a relação entre as entidades:
![image](https://github.com/user-attachments/assets/b91c10a1-1088-47a4-a688-57d309503856)

Entidades em implementação: User, Plane, Seat, Crew, Notification e CityWeather.


> Feito por: Rodrigo Abreu (Team Manager) 
