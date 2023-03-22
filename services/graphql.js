import react from "react";
import { request, gql } from "graphql-request";

const graphqlAPI = 'https://api-us-east-1-shared-usea1-02.hygraph.com/v2/cld38p0bt04x701upa070gmo6/master'

export const getUsers = async () => {
  const query = gql`
    query MyQuery {
        usuarios {
          name
          phone
          id
          type
        }
      }
    `
  const result = await request(graphqlAPI, query)
  return result.usuarios
}

export const createUser = async (name, phone, password) => {
  const query = gql`
    mutation MyMutation {
        createUsuario(data: {phone: ${phone} , name: "${name}" , type: "user",  password: "${password}" }) {
          id
          name
          phone
          type
          password
        }
      }
      `
  const result = await request(graphqlAPI, query)
  return result.createUsuario
}
export const publishUser = async (id) => {
  const query = gql`
  mutation MyMutation {
    publishUsuario(to: PUBLISHED, where: {id: "${id}"}) {
      id
    }
  }
  `
  const result = await request(graphqlAPI, query)
  return result
}

export const getUserLogin = async (number, password) => {
  const query = gql`
  query MyQuery {
    usuarios(where: {phone: ${number} , password: "${password}"}) {
      password
      name
      phone
      id
      type
    }
  }
  `
  const result = await request(graphqlAPI, query)
  return result.usuarios
}

export const postTravel = async (name, phone, userId, destinationLatitude, destinationLongitude, originLatitude, originLongitude, cost, distance, time, travelstatus, originCity, originState, originAdress, destinationAdress, travelType, travelDate, travelTime) => {
  const query = gql`
  mutation MyMutation {
    createViajes(
      data: {cost: "${cost}", distance: "${distance}", name: "${name}", phone: ${phone} , time: "${time}", travelStatus: "${travelstatus}", userId: "${userId}", destinationLatitude: "${destinationLatitude}", destinationLongitude: "${destinationLongitude}", originLatitude: "${originLatitude}", originLongitude: "${originLongitude}", originAdress: "${originAdress}", originCity: "${originCity}",originState: "${originState}", destinationAdress: "${destinationAdress}", travelType: "${travelType}", travelDate: "${travelDate}", travelTime: "${travelTime}" }
    ){
      id
    }
  }`

  const result = await request(graphqlAPI, query)
  return result.createViajes


}
export const publishTravel = async (id) => {
  const query = gql`
  mutation MyMutation {
    publishViajes(to: PUBLISHED, where: { id: "${id}" }){
      id
    }
  }`
  const result = await request(graphqlAPI, query)
  return result
}

export const getUserTravels = async (id) => {
  const query = gql`
  query MyQuery {
    viaje(where: {userId: "${id}"}, , orderBy: createdAt_DESC) {
      cost
    distance
    name
    phone
    driver
    driverPhone
    originAdress
    originCity
    originState
    originLongitude
    originLatitude
    time
    travelStatus
    destinationLongitude
    destinationLatitude
    destinationAdress
    id
    createdAt
    updatedAt
    travelDate
    travelTime
    travelType
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.viaje
}
export const getTravels = async () => {
  const query = gql`
  query MyQuery {
    viaje(where: {travelStatus: "Pendiente"}, orderBy: publishedAt_DESC) {
      cost
      distance
      time
      travelStatus
      destinationLatitude
      destinationLongitude
      originLatitude
      originLongitude
      id
      name
      phone
      originCity
      originState
      originAdress
      destinationAdress
      publishedAt
      createdAt
      travelDate
    travelTime
    travelType
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.viaje
}
export const getSingleTrip = async (id) => {
  const query = gql`
  query MyQuery {
    viaje(where: {id: "${id}", travelStatus: "Pendiente"}){
      id
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.viaje
}
export const updateTrip = async (id, name, phone, driverId) => {
  const query = gql`
  mutation MyMutation {
    updateViajes(
      data: {driver: "${name}", driverPhone: "${phone}", travelStatus: "Aceptado", driverId: "${driverId}" }
      where: {id: "${id}"}
    ) {
      id
    }
  }
  `
  const result = await request(graphqlAPI, query)
  return result
}
export const endTrip = async (id) => {
  const query = gql`
  mutation MyMutation {
    updateViajes(
      data: {travelStatus: "Completado" }
      where: {id: "${id}"}
    ) {
      id
    }
  }
  `
  const result = await request(graphqlAPI, query)
  return result
}
export const cancelTrip = async (id) => {
  const query = gql`
  mutation MyMutation {
    updateViajes(
      data: {travelStatus: "Cancelado" }
      where: {id: "${id}"}
    ) {
      id
    }
  }
  `
  const result = await request(graphqlAPI, query)
  return result
}

export const getDriverTrips = async (driverId) => {
  const query = gql`
  query MyQuery {
    viaje(where: {driverId: "${driverId}"}, orderBy: publishedAt_DESC) {
      cost
      distance
      time
      travelStatus
      destinationLatitude
      destinationLongitude
      originLatitude
      originLongitude
      id
      name
      phone
      originCity
      originState
      originAdress
      destinationAdress
      driverId
      publishedAt
    createdAt
    travelDate
    travelTime
    travelType
    }
  }
  `
  const result = await request(graphqlAPI, query)
  return result.viaje
}
export const createDiver = async (name, phone, password) => {
  const query = gql`
    mutation MyMutation {
      createDiver(data: {phone: "${phone}" , name: "${name}" ,   password: "${password}" }) {
          id
          name
          phone
          password
        }
      }
      `
  const result = await request(graphqlAPI, query)
  return result.createDiver
}
export const driverLogin = async (phone, password) => {
  const query = gql`
  query MyQuery {
    divers(where: {password: "${password}", phone: "${phone}"}) {
      id
      name
      password
      phone
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.divers
}
export const checkDiver = async (id) => {
  const query = gql`
  query MyQuery {
    diver(where: {id: "${id}"}, stage: PUBLISHED) {
      name
      id
      password
      phone
    }
  }
  `
  const result = await request(graphqlAPI, query)
  return result.diver

}

//admin stuff
export const loginAdmin = async (phone, password) => {
  const query = gql`
  query MyQuery {
    admins(where: {phone: "${phone}", password: "${password}"}) {
      name
      id
      phone
      password
    }
  }
  `
  const result = await request(graphqlAPI, query)
  return result.admins[0]

}
export const getAllUsers = async () => {
  const query = gql`
  query MyQuery {
    usuarios {
      id
      password
      name
      phone
    }
  }
  `
  const result = await request(graphqlAPI, query)
  return result.usuarios
}
export const deleteTrip = async (id) => {
  const query = gql`
 mutation MyMutation {
  deleteViajes(where: {id: "${id}"}){
    id
  }
}`
  const result = await request(graphqlAPI, query)
  return result.deleteViajes

}
export const getUnpublishedDrivers = async (id) => {
  const query = gql`
  query MyQuery {
    diver(where: {id: "${id}"}, stage: DRAFT) {
      name
      id
      password
      phone
    }
  }
`
  const result = await request(graphqlAPI, query)
  return result.divers
}
export const publishDriver = async (id) => {
  const query = gql`
  mutation MyMutation {
    publishDiver(where: {id: "${id}"}){
      id
    }
  }
  `
  const result = await request(graphqlAPI, query)
  return result
}
export const getAllDrivers = async (name) => {
  const query = gql`
  query MyQuery {
    divers(where: {name_contains: "${name}"}) {
      id
      name
      password
      phone
      balance
    }
  }
  `
  const result = await request(graphqlAPI, query)
  return result.divers
}
export const getDriverPendingTrips = async (driverId) => {
  const query = gql`
  query MyQuery {
    viaje(where: {travelStatus: "Completado", driverId: "${driverId}"} , orderBy: createdAt_DESC) {
      cost
      distance
      time
      travelStatus
      destinationLatitude
      destinationLongitude
      originLatitude
      originLongitude
      id
      name
      phone
      originCity
      originState
      originAdress
      destinationAdress
      driverId
      createdAt
      updatedAt
      travelDate
    travelTime
    travelType
    }
  }
  `
  const result = await request(graphqlAPI, query)
  return result.viaje
}

export const deleteFinishedTrips = async (id) => {
  const query = gql`
  mutation MyMutation {
    deleteManyViaje(where: {driverId: "${id}", travelStatus: "Completado" }){
      count
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.deleteManyViaje
}
export const deleteAllTrips = async (id) => {
  const query = gql`
  mutation MyMutation {
    deleteManyViaje(where: {driverId: "${id}"}){
      count
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.deleteManyViaje
}
export const updateDriverBalance = async (id, balance) => {
  const query = gql`
  mutation MyMutation {
    updateDiver(data: {balance: ${balance} }, where: {id: "${id}"}){
      balance
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.updateDiver
}
export const getDriverBalance = async (id) => {
  const query = gql`query MyQuery {
    diver(where: {id: "${id}"}) {
      balance
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.diver

}
/////////////////////////////////////////////////Driver Locations
export const getDriverRecord = async (id) => {
  const query = gql`
  query MyQuery {
    driverLocations(where: {driverId: "${id}"}) {
      id
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.driverLocations

}
export const getDriversLocation = async () => {
  const query = gql`
  query MyQuery {
    driverLocations {
      id
      latitude
      longitude
      name
      publishedAt
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.driverLocations

}
export const createDriverLocation = async (latitude, longitude, name, id) => {
  const query = gql`
  mutation MyMutation {
    createDriverLocation(
      data: {latitude: "${latitude}", longitude: "${longitude}", name: "${name}", driverId: "${id}"}    
    ) {
      id
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.createDriverLocation

}
export const publishDriverLocation = async (id) => {
  const query = gql`
  mutation MyMutation {
    publishDriverLocation(where: {id: "${id}"}, to: PUBLISHED){
      id
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.createDriverLocation

}
export const updateDriverLocation = async (id, latitude, longitude) => {
  const query = gql`
  mutation MyMutation {
    updateDriverLocation(
      data: {latitude: "${latitude}", longitude: "${longitude}"}
      where: {id: "${id}"}
    ) {
      id
    }
  }`
  const result = await request(graphqlAPI, query)
  return result.updateDriverLocation

}
export const getExistingTrips = async () => {
  const query = gql`
  query MyQuery {
    viaje(orderBy: publishedAt_DESC) {
      cost
      distance
      driver
      driverPhone
      time
      travelStatus
      destinationLatitude
      destinationLongitude
      originLatitude
      originLongitude
      id
      name
      phone
      originCity
      originState
      originAdress
      destinationAdress
      publishedAt
      createdAt
      travelDate
      travelTime
      travelType
    }
  }
  
  `
  const result = await request(graphqlAPI, query)
  return result.viaje
}





