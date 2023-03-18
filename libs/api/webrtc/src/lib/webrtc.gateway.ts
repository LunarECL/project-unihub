// import {
//   ConnectedSocket,
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { rooms, users } from './webrtc.server';
// import { startMediasoupServer } from './webrtc.server';
// import { Producer, WebRtcTransport } from 'mediasoup/node/lib/types';

// @WebSocketGateway({ namespace: '/mediasoup' })
// export class MediasoupController {
//   @WebSocketServer()
//   server: any;

//   constructor() {
//     startMediasoupServer(this.server);
//   }

//   @SubscribeMessage('join-room')
//   handleJoinRoom(
//     @ConnectedSocket() socket: any,
//     @MessageBody() data: { roomId: string; userId: string; userName: string }
//   ) {
//     socket.emit('room-joined', { success: true });

//     socket.to(data.roomId).emit('user-joined', {
//       userId: data.userId,
//       userName: data.userName,
//     });
//   }

//   @SubscribeMessage('leave-room')
//   handleLeaveRoom(
//     @ConnectedSocket() socket: any,
//     @MessageBody() data: { roomId: string; userId: string; userName: string }
//   ) {
//     socket.emit('room-left', { success: true });

//     socket.to(data.roomId).emit('user-left', {
//       userId: data.userId,
//       userName: data.userName,
//     });
//   }

//   @SubscribeMessage('send-message')
//   handleSendMessage(
//     @ConnectedSocket() socket: any,
//     @MessageBody() data: { roomId: string; userId: string; message: string }
//   ) {
//     socket.to(data.roomId).emit('message-received', {
//       userId: data.userId,
//       message: data.message,
//     });
//   }
//   @SubscribeMessage('transport-connect')
//   async handleTransportConnect(
//     @ConnectedSocket() socket: any,
//     @MessageBody()
//     data: {
//       roomId: string;
//       userId: string;
//       transportId: string;
//       dtlsParameters: any;
//     }
//   ) {
//     const user = Array.from(users.values()).find(
//       (u) => u.room === data.roomId && u.id === data.userId
//     );

//     if (!user) {
//       console.warn(`User ${data.userId} not found in room ${data.roomId}`);
//       return;
//     }

//     const room = rooms.get(data.roomId);

//     if (!room) {
//       console.warn(`Room ${data.roomId} not found`);
//       return;
//     }

//     const transport = room.transports.get(data.transportId);

//     if (!transport) {
//       console.warn(`Transport ${data.transportId} not found`);
//       return;
//     }

//     await transport.connect({ dtlsParameters: data.dtlsParameters });

//     socket.emit('transport-connected', { success: true });
//   }

//   @SubscribeMessage('produce')
//   async handleProduce(
//     @ConnectedSocket() socket: any,
//     @MessageBody()
//     data: {
//       roomId: string;
//       userId: string;
//       transportId: string;
//       kind: 'audio' | 'video'; // Use a union type instead of string
//       rtpParameters: any;
//     }
//   ) {
//     const user = Array.from(users.values()).find(
//       (u) => u.room === data.roomId && u.id === data.userId
//     );

//     if (!user) {
//       console.warn(`User ${data.userId} not found in room ${data.roomId}`);
//       return;
//     }

//     const room = rooms.get(data.roomId);

//     if (!room) {
//       console.warn(`Room ${data.roomId} not found`);
//       return;
//     }

//     const transport = room.transports.get(data.transportId);

//     if (!transport) {
//       console.warn(`Transport ${data.transportId} not found`);
//       return;
//     }

//     const producer = await transport.produce({
//       kind: data.kind,
//       rtpParameters: data.rtpParameters, // Use data.rtpParameters instead of rtpParameters
//     });

//     socket.emit('producer-created', {
//       producerId: producer.id,
//       kind: producer.kind,
//       rtpParameters: producer.rtpParameters,
//     });
//   }

//   @SubscribeMessage('consume')
//   async handleConsume(
//     @ConnectedSocket() socket: any,
//     @MessageBody()
//     data: {
//       roomId: string;
//       userId: string;
//       consumerTransportId: string;
//       producerId: string;
//       rtpCapabilities: any;
//     }
//   ) {
//     const user = Array.from(users.values()).find(
//       (u) => u.room === data.roomId && u.id === data.userId
//     );

//     if (!user) {
//       console.warn(`User ${data.userId} not found in room ${data.roomId}`);
//       return;
//     }

//     const room = rooms.get(data.roomId);

//     if (!room) {
//       console.warn(`Room ${data.roomId} not found`);
//       return;
//     }

//     const consumerTransport = room.transports.get(
//       data.consumerTransportId
//     ) as WebRtcTransport;

//     if (!consumerTransport) {
//       console.warn(`Transport ${data.consumerTransportId} not found`);
//       return;
//     }

//     const producer = Array.from(room?.producers?.values() ?? []).find(
//       (p) => p.id === data.producerId
//     ) as Producer;

//     if (!producer) {
//       console.warn(`Producer ${data.producerId} not found`);
//       return;
//     }

//     const consumer = await consumerTransport.consume({
//       producerId: producer.id,
//       rtpCapabilities: data.rtpCapabilities,
//       paused: true,
//     });

//     consumer.on('producerclose', () => {
//       console.log(`Consumer's producer closed: ${consumer.id}`);
//       consumer.close();
//     });

//     socket.emit('consumer-created', {
//       consumerId: consumer.id,
//       producerId: producer.id,
//       kind: producer.kind,
//       rtpParameters: consumer.rtpParameters,
//     });
//   }

//   @SubscribeMessage('resume-consumer')
//   async handleResumeConsumer(
//     @ConnectedSocket() socket: any,
//     @MessageBody()
//     data: {
//       roomId: string;
//       userId: string;
//       consumerTransportId: string;
//       consumerId: string;
//     }
//   ) {
//     const user = Array.from(users.values()).find(
//       (u) => u.room === data.roomId && u.id === data.userId
//     );

//     if (!user) {
//       console.warn(`User ${data.userId} not found in room ${data.roomId}`);
//       return;
//     }

//     const room = rooms.get(data.roomId);

//     if (!room) {
//       console.warn(`Room ${data.roomId} not found`);
//       return;
//     }

//     const consumerTransport = room.transports.get(data.consumerTransportId);

//     if (!consumerTransport) {
//       console.warn(`Transport ${data.consumerTransportId} not found`);
//       return;
//     }

//     const consumer = (consumerTransport as any).consumers.get(data.consumerId);
//     if (!consumer) {
//       console.warn(`Consumer ${data.consumerId} not found`);
//       return;
//     }

//     await consumer.resume();

//     socket.emit('consumer-resumed', { success: true });
//   }

//   @SubscribeMessage('pause-consumer')
//   async handlePauseConsumer(
//     @ConnectedSocket() socket: any,
//     @MessageBody()
//     data: {
//       roomId: string;
//       userId: string;
//       consumerTransportId: string;
//       consumerId: string;
//     }
//   ) {
//     const user = Array.from(users.values()).find(
//       (u) => u.room === data.roomId && u.id === data.userId
//     );

//     if (!user) {
//       console.warn(`User ${data.userId} not found in room ${data.roomId}`);
//       return;
//     }

//     const room = rooms.get(data.roomId);

//     if (!room) {
//       console.warn(`Room ${data.roomId} not found`);
//       return;
//     }

//     const consumerTransport = room.transports.get(data.consumerTransportId);

//     if (!consumerTransport) {
//       console.warn(`Transport ${data.consumerTransportId} not found`);
//       return;
//     }

//     const consumer = (consumerTransport as any).consumers.get(data.consumerId);

//     if (!consumer) {
//       console.warn(`Consumer ${data.consumerId} not found`);
//       return;
//     }

//     await consumer.pause();

//     socket.emit('consumer-paused', { success: true });
//   }
// }
