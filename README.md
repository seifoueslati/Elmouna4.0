# ElMouna4.0

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)
![image](https://github.com/othneildrew/Best-README-Template/raw/master/images/logo.png)
With the rise of nomadism and mobility, a strong need for localization emerged and became an active research field. Localization consists of determining positions of a mobile entity that could be people, equipment, and other objects around. This is called «positioning». It can be classified into two types «outdoor positioning» and «indoor positioning» depending 
on the environment. Outdoor positioning is relatively easy thanks to satellites: GPS (Global Positioning  System) but for indoor positioning, it’s another story, the determination of a position can be complicated and remains hard to handle. In fact, GPS is not suitable to establish indoor locations, since it is limited to the outside due to signal attenuation caused by obstacles. 

Recently, significant improvements have been made for the indoor positioning. Indeed, motivated by the recent advances on internet of things (IoT) which became the new technological paradigm that is changing our lives, and the importance that location information has on many applications, different RTLS (Real-Time Location System) have been developed to overcome this problem, which has made ground-breaking improvements to industries such as healthcare, livestock farming, manufacturing, and warehousing. 

Actually, my project is treating the warehousing domain. It consists of implementing an « Indoor positioning IoT-based system » in a storage space. This is done using IoT sensors placed over different racks and forklifts in a warehouse as shown on the figure below, to track their displacement and monitor the whole process of storage and recovery of incoming and outgoing goods and locate the required ones. 

The tracked positions can be displayed on a map over a dashboard that helps in the monitoring task and offers many other functionalities.


 ![image](https://github.com/seifoueslati/Elmouna4.0/blob/main/logo.png?raw=true)
 

The purpous of this project is to conceive an indoor positioning IoT based system inside the warehouse using decawave’s nodes as IoT sensors. This involves two main phases:

- Network dimensioning and planning to estimate the material requirements, where and how to place it plus the evaluation of the costs.
- Dashboard development for visualization and monitoring. The system will get IoT data sent from the placed nodes «Anchor» and the mobile object «Tag». Once the data acquired, the position calculated in real-time, will be published in the «MQTT Broker». We have to subscribe to it so we can retrieve the data and store it in the database for further processing and display the output on the dashboard.

Comparison between RTLS existing systems

![image](https://github.com/seifoueslati/Elmouna4.0/blob/main/tab.jpg?raw=true)

==>MDEK1001 Development Kit from DECAWAVE is the solution that will be used for the deployment of the system for this project. This choice was made after discussing with the  customer since it offers the best quality-price ratio and fits to their limited budget. 

# ELMOUNA4.0

The idea is to conceive an indoor positioning IoT based system inside the warehouse using decawave’s nodes as IoT sensors. This involves two main phases:

- Network dimensioning and planning to estimate the material requirements, where and how to place it plus the evaluation of the costs. 
- Dashboard development for visualization and monitoring. The system will get IoT data sent from the placed nodes «Anchor» and the mobile object «Tag». Once the data acquired, the position calculated in real-time, will be published in the «MQTT Broker». We have to subscribe to it so we can retrieve the data and store it in the database for further processing and display the output on the dashboard. 
## Physical architecture 
The figure below represents the physical architecture of the proposed solution. 

![image](https://github.com/seifoueslati/Elmouna4.0/blob/main/ar.jpg?raw=true)


- Client: The web browser which allows the user to access the different interfaces of the dashboard. 
- FrontEnd AppServer: hosts the frontend application used by end-users. 
- BackEnd AppServer: The server that hosts the backend application which listens for 
requests coming from the frontend application, retrieves information from the 
database and sends back a response understandable and representable to it. 
- Database Server: Allows to store and retrieve the data into/from the database 
depending on the request coming from the backend application by executing the 
convenient query and send back the needed data to it. 
- UWB RTLS Network: The IPS sensors. This will be explained later with more details. 


## Logical architecture 
The figure describes the logical architecture of the proposed solution. 

![image](https://lh3.googleusercontent.com/uEYvLz8TK0j7r6CP7J8SpX-wxSLHGdWrxBhNmaI89jCYzMxNFNe1ICxz7o-yN6QvEkHGaNMhkuv1O8cJbs4JoHaS0pBO1m1Hcx4Ub8HezIaJqW9pE6kmMy6BD3ZVn_Vztpi53W8)


- UWB RTLS network: 
The network is made up of decawave’s modules which can be configured to behave as «anchors», fixed nodes in the system, «tags» which are mobile nodes, or « bridge nodes » which has to be associated to a « Raspberry pi 3 Model B card » to form a « Gateway» (MQTT Broker) that route the data within the UWB network. One anchor has to be configured as an «initiator» which will start, control and synchronize the network. 
- Influxdb: 
An open-source time-series database dedicated to IoT applications since it is optimized for a fast and huge capacity of storage, real-time capture of data emitted by sensors and high- availability. It is the database that will be used to store our IPS IoT data. 
- NodeJS program: 
Subscribe to the MQTT Broker, retrieve data and store it into Influxdb. 
- Dashboard: 
It serves for visualization and monitoring. We will use the «Spring Boot» framework for the development of the backend application (REST-API) and «Angular» for the frontend application. Since the influxDB database is dedicated to IoT usage, it was only used with the first spring service which is dedicated to processing based on IoT collected data and we will create a second service linked to MySQL database for the rest 
# I.NETWORKING
### 1.THEORETICAL STUDY AND NETWORK DIMENSIONING

Indoor positioning systems are based on real-time location systems (RTLS) to automatically and continuously identify and track the location of objects in an indoor environment. Those systems are used for many applications such as providing indoor navigation systems for blinds, locating devices within buildings, aiding tourists in museums, helping customers find their way in large supermarkets and malls or by guiding them to products, tracking kids in crowded places. Their usage has brought ground-breaking improvements into many areas including the retail sector, industry, transport, healthcare... 

IPSs use numerous positioning technologies, that vary greatly according to five main qualities [B8] representing the performances metrics of IPS that have to be taken into account depending on the application requirements including: 
 -  System accuracy and precision: the closeness of agreement between the calculated and the true position. Lower measurement error means higher accuracy. 
- Coverage and its resolution: the area that is covered by the IPS. Each IPS works in a different range (from 5 meters to 50 meters.). The most effective systems are the 
ones that cover the widest range. 
- Latency in making location updates and measuring the position. 
- Building’s infrastructure impact: indoor spaces present some problems having a direct vision between the signal source and target as it is obstructed by many elements from objects to people to structures. This would cause signal attenuation and interference which will cause a certain error rate in measurements. 
- Energy consumption: This metric is particularly important for mobile nodes. It represents the life-time of a component of the device, the battery. 

The ultimate challenge is to manage the complex tradeoff between maximizing the accuracy and minimizing the error rate while having the largest coverage area and less power consumption. 

## Indoor Positioning techniques: 
There are five basic position measurement methods used in IPSs to determinate the distance between two nodes including Time of Arrival (TOA) and Time of Flight (TOF), Time Difference of Arrival (TDOA), Angle of Arrival (AOA) and Received Signal Strength (RSS). 
##### Time of Arrival (TOA): 
TOA, which is also known as Time of Flight (TOF), is the simplest and most common ranging technique. It consists of measuring the time it takes for the radio signal sent by the transmitter to arrive at the receiver. The initiator transmits a radio message to the responder and records its time of transmission t1. The responder receives the message and transmits a response back to the initiator after a particular delay treply. The initiator then receives this response and records a receive timestamp  . 
This is done by synchronizing the transmitters and the receiver's clock. The TOF is then calculated by this formula: 

![image](https://lh4.googleusercontent.com/av6Z0Yzcv4jQrERT9EQy_McF53DoUvPDI9iJeNB1vwgbBcVgP-QYCT69TTluay5CMADHDSF8CQ7KHefxMo3WgJKTqO59kxcQXhw1gFZvwEkxseLpG-ONv-omrUbw7zxOoIGNqdk)

According to this, the distance can be calculated due to the known speed of the radio signal, which is the same as the speed of light “C”As it is shown in the figure below, TOA is based on the intersection of circles for multiple transmitters (minimum three). The radius of those circles is the distance between the transmitter and the receiver. 

![image](https://lh4.googleusercontent.com/CD4H3n0gFOtRlVoq_QoLD_nngXAkW2aq_BjS8V8Qz8EX9F74x42uT6A0a1VNlTNZLw5XPWMEyRYqq_uR-2eDt8Pf7_c-fybd3QathktYz1x8vHqFAz7zVfkW_6oEKSGtbbBSimc)


##### Time Difference of Arrival (TDOA): 


TDOA is based on measuring the time difference of arrival of a signal sent by an object and received by three or more receivers to calculate the distance. Each difference of arrival time measurement produces a hyperbolic curve in the localization space on which the location of the mobile node lies. 

![image](https://lh5.googleusercontent.com/zAKeFwj1zrD2QrVAou12LX6SEU93QMwBL6GhcTc04qHnSM3FiKA37UsFp3xY4BayFYF-yfSQFHnTTJPaofSYUBW-eihJakRtzHNhFKSpdB9yfFZOx9oMldmYI8znaqo1jkhXWEs)

##### Angle of Arrival (AOA): 
AOA is the angle and distance calculated relative to two (at least) or multiple references (for better accuracy) with known location through the intersection of direction lines between the reference points. 

![image](https://lh3.googleusercontent.com/L9xIbTgyrwUV9O43G0KsAx70gR5eNjRDMqd6iutJLEAt0sbb7HIarvBPng59ncMr3x2pfjtdVhVMN24fKpdvJczs7dPaJdJvEmzUqFc0xJhp9fyAnQ41UswRd-aMERvrl_Zh8bo)

Received Signal Strength (RSS): 
Unlike methods seen previously, the RSS is a signal strength-based technique. In fact, the tracked target measures the signal strength for received signals from multiple transmitters in order to use signal strength as an estimator of the distance between the transmitters and receivers. In other words, the RSS approach measures the signal attenuation of transmitted signals to calculate the signal strength reduction or loss due to propagation, hence the distance between mobile devices can be estimated [B6]. The attenuation of signal strength is inversely proportional to the distance. 
However, in indoor environments where it is difficult to obtain line-of-sight (LOS) because of obstacles, the RSSI and positioning may be affected by multipath and shadow, hence decreasing accuracy. 

## 2.Network deployment
Before starting our network deployment, an experiment was conducted to test the effectiveness and credibility of the measures. To do so, we placed our nodes in an area of 170m2 (17 x 10 meters) on NLOS conditions (Obstacles: walls, glazed walls, people). 
The anchors were placed on walls at a height of 2 meters at each corner to cover the whole space, and the gateway was placed in the meeting room where we had access to connectivity as illustrated over the figure below. 
![image](https://lh5.googleusercontent.com/Xi9OYFZ5kV7QMxfH38tWYOYwo0TCiLoKSKvEXmfR2333KNUBLELOno8sbOIHQSNpoqFW2CxQja82pLc251Zjd5Ds-A5Y3uADkG_1pClVI6hLkYLOrFYAD43pR-e1R3M4td2OcEA)
After placing the entities, we have to configure each node with the corresponding properties then start the tests. 



#### Nodes configuration 
The DWM1001 module DWM1001 comes with a pre-flashed factory image of firmware. So the first step consists of flashing each node with the provided image. To do so we used « Segger J-Flash Lite » tool. 

![image](https://lh3.googleusercontent.com/oBXdHh8w7YPV98Mu_w-WPNBD2R0M68Xa70auf8R2zt2ahCU7Mgnn8alTFp8OaFKMIEuzZ7SqPVwvLYSNFJ3WHF4toLgHCfGwmK21zKzMaYf6xEMJkoSNeKxGPHq3nYCibpBn33w)

❖ Flash nodes : 
We start by connecting the node to the computer through USB, editing the parameters as described in figure below, selecting the « DWM1001_PANS_R2. hex » image file and click on program device. 
❖ Configure Anchors: 
The configuration is made by serial port over UART (Universal Asynchronous Receiver Transmitter) communication via USB connection and using «Tera Term» tool. 
- First of all, we have to connect to the virtual com port selected automatically to create a serial communication and enter to the DWM1001 UART shell mode. The serial port configuration should be as defined in the figure below. 
- To define a node as an «Anchor» we have to use the «nma» command set the network id by «nis» command and set the coordinates (x,y,z) by «aps» command as shown in the following figure. 
- We can use «si» command to display the nodes' info to ensure that the node has been correctly configured. 

❖ Configure Initiator: 
- Same as anchor config we have to create a serial port connection and access to the DWM1001 UART shell mode. We have to use the «nmi» command to define a node as an «Initiator» set the network id by «nis» command and set the coordinates (x,y,z) by 
«aps» command as shown in the following figure. 
- We notice through the figure that the node has been correctly configured on initiator mode. 

❖ Configure Tag: 
- In the same way, explained previously we have to create a serial port connection and access to the DWM1001 UART shell mode to start the configuration. This time, we only have to define the node mode as «Tag» through the «nmt» command and set the   network id by «nis» command since the tag position is calculated by the node. 
❖ Configure Gateway: 
- A gateway consists of a DWM1001 module configured as a «bridge node» connected to a Raspberry Pi 3 Model B card. 
--------------------------------------------

![image](https://lh5.googleusercontent.com/khHGWuipNOtISp-z8q03GI_ly-82NmYRKeBOtMavsdcthkRyFISFo7OcAy2-t_Ip-gTEd6F17PnbJfgG5uPuqtXIisknqBSy6-zK2Thd)

➢ Bridge node setup: 
• After creating a serial port connection and accessing to the DWM1001 UART shell mode, we use the «nmb» command to set the device as a «bridge node». 
➢ Raspberry Pi setup: 
• We started by flashing the provided Raspberry Pi image. 
• The Raspberry Pi encapsulates an MQTT Broker. So the second step consists of connecting remotely to the Raspberry Pi by creating an SSH connection using Tera Term and get the broker properties that will be used later to publish and subscribe to it. To do so the card and the computer must be connected to the same network. 
• Using Tera Term, we select a TCP/IP connection and set the Raspberry pi IP address then we connect to it using the convenient credentials. 
Dwm1001.config is used for the configuration of bridge node characteristics such as PAN ID (network ID) which has to be the same as used in the sensors. In the case of a larger network, we have to use more than a gateway to cover the whole area as explained in the dimensioning section which will report the data they collect to the centralized gateway hosting the proxy server. 
This is done by editing the «proxy-server-host» property of each new gateway added to the network with the centralized gateway IP address. dwm1001-proxy.config is used for the MQTT configuration: MQTT broker connection credentials, the server port, the proxy IP address, and the topic prefix. 



### Retrieve data 
To simplify the tests, we placed the tag at a fix position to compare the real coordinates to the measured one. The positions of each node on the grid, including the immobile tag, are outlined in the table below. 
Node ID Type X position (m) Y position (m) 030c TAG 1.75 2.5  10A8 INITIATOR 0 0 8E08 ANCHOR -17 0 D704 ANCHOR -17 -17 14A0 ANCHOR 0 -17 
In order to read the data exchanged between the nodes and the gateway and get the position measured by the tag, we have to subscribe to the Broker on the convenient topic.
A suitable tool to explore the MQTT broker and create publish-subscribe connections is MQTTfx. 
- We start by connecting to the broker by setting the parameters with the properties found on the dwm1001-proxy.config file.
- Once connected to the MQTT broker, we scan for the different topics available to subscribe to the convenient one to read the needed data. Those topics are created .

once a unit is connected to the network associated with the in-range gateway and the formats are predefined by the firmware of the kit
• As noticed on the figure above there is: 
- 1 topic related to the gateway «dwm/gateway/id/uplink» where we can find the networkID, the bridge node ID and the proxy IP address. 
- 2 topics related to the anchors «dwm/gateway/id/uplink/config» where we can get the position and the type (anchor or initiator), «dwm/gateway/id/uplink/status» where we can find the node state. 
- 3 topics associated to the tags «dwm/gateway/id/uplink/config or status» and in addition «dwm/gateway/id/uplink/locate on» which is related to the tag position. 

![image](https://lh4.googleusercontent.com/ohhZvUOzATI2c-trvGoqd9XrCyyCa6xcCxbOdfGYU-26u4LuTwiJUMMJJiCYU2fLNxHT-aIhiAzFf4MdvtPB8mAnkqm7rbqUBtOPewUaD8bOgtz-A9BOXqaw6j_02PE75ITMiVY)

--------------------------
---------------------
-------------------------------
# WEBSITE AND USER INTERFACE

In this project we have 3 users , each has his own role and interface .
#### - Worker A is responsible for scanning and getting new products
![image](https://lh4.googleusercontent.com/cGn-Aagm3mGUdXqkYD9qdEyEWLHzSbzRrjAVxI4MWJsl7rUvQbTM9a3ekQKZcn0jcSaf2o51xTQXvHiTWK7Iuat7emvIi1iGxPl_weA8)
![image](https://lh6.googleusercontent.com/iKkfA3k91CKyK3t5zNbtcr3obHllHf8wIgz4_tllBSbp2Oa4j_eoKCwiVUPp987ja6Fcsa2ox701AWVhiQj0It2Sawh41OU0G2x7a-jJ189j6DbnQe0z7LElyvvgprTQmYMPH1Q)
![image](https://lh5.googleusercontent.com/aKGpMgt6tMCcoFN7SP270rlC4RT1VjrX4Lw4sKJ72VtHaTk9yS7i0w9P0Ru2o3QhFEFgBwqYi9Bc19gR7_GAUk1_6TxdYfxUN9IX0bXwt96hqZJt-IPMcjNd-ieuOfjPfN8-1Lw)


#### - Worker B is responsible for placing the products , he has a list of tasks given by Worker A
![image](https://lh3.googleusercontent.com/QMDWPtrqvCUCw7fvMun0dHXnuskA0g3WaynwFZOw0DQ-uLgC34AsQSfbAm9wEFvYDO-DRtvFeBF5yu37ZaYJsLFLxSzj4nxjpRdhjTFvBu-RQE4nEEpCZqRD1jtzbCfNXQ4FOZ0)
![image](https://lh5.googleusercontent.com/Jjt-bxwDP5kTcamfefVUA_dDU3ASG5NRProbdpY0q3-oacnuY0fjD42j92XvYnZ9FFyB6hLnaaFM4vVVeL51c8I71Ui8WYOEnG26TMhIgMfxIwC58WUBiQjYKvD9M3UHThyxjng)
![image](https://lh5.googleusercontent.com/CdrUV93CAsxidZk3l21UJNwLj75IwmEhJtKEcHYZc-qI5glxDSRNJcsEG--j9yL-W9bmUEbPS4N8OM7j23RpQbzSWENk4IkSxQPHSEcvwHs9eMNnLRIyCpMFJWX6NzLEg7UfGNM)
#### -The Administrator who has the ability to see everything and everyone 
- ![image](https://lh6.googleusercontent.com/AHcM4OZGUCysXjzyVJ7KbN9h3-vDtGXTFRQ9JTHXHbBRXKKeHTtqqKnaV-XjG3KU0sa6ZH-yI-kXXdganfcnVV2mRonAy0-5YVpBw_5feJnUt_TXcmd0B6AGeTtJyWCTdY3SbcQ)
![image](https://lh3.googleusercontent.com/BuRU-jK15dwTSWbQm-5onW_V4ZP-sY6uS7R24msx3VYnbCrreSshQuCcwjWp1t6HCB7-BtuxcgK9pJ1pfuTEd88bDVY7x12tTunEvNlT173YGzyzspZKmWKYgw0gfXoH4jFZH3Q)
![image](https://lh4.googleusercontent.com/bGlNvxx4hOUHM-kiNJtE7R1R131mmOmGVyRyFLRqz7R2TQf2Zm4sML0FNhHSDukxDlHHVDg_P86SMo94DWszc2tz6zYFjbs41gFKbL2F0h5sCDRFBc5vfSFcYEJxGA3tTNbg_7w)

----------------
--------------------------
-------------------------
# WAYFINDING !
Wayfinding refers to information systems that guide people through a physical environment and enhance their understanding and experience of the space. Wayfinding is particularly important in complex built environments such as WAREHOUSES
This is the matrix that i did for creating the map , each 0 refers to an open space and the 1’s for obstacles 
![image](https://lh3.googleusercontent.com/do2PJ68VewImuJC-6RDOAF3wEQcJLRk2IEIHwj3IXN7jFLFHyNk7oprXjUhGgcbCnP4u7bTysahMlzSKponprSqmgjUoqcBU9MfMzvO85NFaNDZkvuThroA0V2hKixOTatB_vRg)

![image](https://lh5.googleusercontent.com/Xi9OYFZ5kV7QMxfH38tWYOYwo0TCiLoKSKvEXmfR2333KNUBLELOno8sbOIHQSNpoqFW2CxQja82pLc251Zjd5Ds-A5Y3uADkG_1pClVI6hLkYLOrFYAD43pR-e1R3M4td2OcEA)

### Used Algorithmes 
i used the A* algorithme . A* is a graph traversal and path search algorithm, which is often used in many fields of computer science due to its completeness, optimality, and optimal efficiency. One major practical drawback is its space complexity, as it stores all generated nodes in memory.

------------------------------------------------------------------------------------------



