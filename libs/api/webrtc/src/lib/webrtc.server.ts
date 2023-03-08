import { createWorker } from 'mediasoup';
import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport';
import { Producer } from 'mediasoup/node/lib/types';
import { config } from './config';

interface Room {
  id: string;
  transports: Map<string, WebRtcTransport>;
  producers: Map<string, Producer>;
}

interface User {
  id: string;
  name: string;
  room: string;
}

const rooms = new Map<string, Room>();
const users = new Map<string, User>();

async function createWebRtcTransport(roomId: string, config: any) {
  const worker = await createWorker({
    rtcMinPort: config.mediasoup.worker.rtcMinPort,
    rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
    logLevel: config.mediasoup.worker.logLevel,
    logTags: config.mediasoup.worker.logTags,
  });

  const router = await worker.createRouter({
    mediaCodecs: config.mediasoup.router.mediaCodecs,
  });

  const transport = await router.createWebRtcTransport({
    listenIps: config.mediasoup.transport.listenIps,
    enableUdp: config.mediasoup.transport.enableUdp,
    enableTcp: config.mediasoup.transport.enableTcp,
    preferUdp: config.mediasoup.transport.preferUdp,
  });

  const room: Room = {
    id: roomId,
    transports: new Map(),
    producers: new Map(),
  };
  rooms.set(roomId, room);

  room.transports.set(transport.id, transport);

  return {
    transport,
    router,
    room,
  };
}

export async function startMediasoupServer(server: any) {
  const mediasoupWorker = await createWorker({
    logLevel: config.mediasoup.worker.logLevel,
    logTags: config.mediasoup.worker.logTags,
    rtcMinPort: Number(config.mediasoup.worker.rtcMinPort),
    rtcMaxPort: Number(config.mediasoup.worker.rtcMaxPort),
  });

  const io = server.of('/mediasoup');

  io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on('join-room', async ({ roomId, userId, userName }) => {
      console.log(`Socket ${socket.id} joining room ${roomId} as ${userId}`);

      socket.join(roomId);

      users.set(socket.id, {
        id: socket.id,
        name: userName,
        room: roomId,
      });

      if (!rooms.has(roomId)) {
        console.log(`Creating room ${roomId}`);
        rooms.set(roomId, {
          id: roomId,
          transports: new Map(),
          producers: new Map(),
        });
      }

      io.to(roomId).emit('user-connected', {
        userId,
        userName,
      });

      const room = rooms;

      const existingUsers = Array.from(users.values()).filter(
        (user) => user.room === roomId && user.id !== userId
      );

      socket.emit(
        'existing-users',
        existingUsers.map((u) => u.name)
      );

      const { transport, router } = await createWebRtcTransport(
        roomId,
        mediasoupWorker
      );

      socket.emit('transport-created', {
        transportOptions: {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        },
        routerRtpCapabilities: router.rtpCapabilities,
      });

      socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);

        const user = users.get(socket.id);

        if (user) {
          users.delete(socket.id);

          io.to(roomId).emit('user-disconnected', {
            userId: user.id,
            userName: user.name,
          });

          if (rooms.has(roomId)) {
            const room = rooms.get(roomId);

            if (room.transports.has(transport.id)) {
              const transportObj = room.transports.get(transport.id);

              if (transportObj) {
                transportObj.close();
                room.transports.delete(transportObj.id);
              }
            }

            if (room.transports.size === 0) {
              rooms.delete(roomId);
            }
          }
        }
      });
    });

    socket.on('connect_error', (error) => {
      console.error(`Socket ${socket.id} connection error: ${error.message}`);
    });
  });
}

export { rooms, users };
