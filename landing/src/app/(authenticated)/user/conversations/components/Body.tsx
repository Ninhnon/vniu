'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import MessageBox from './MessageBox';
import React, { useEffect, useRef, useState } from 'react';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import { ImageDialog } from '@/components/imageDialog';
import { z } from 'zod';
import { useImage } from '@/hooks/useImage';
import DialogCustom from '@/components/ui/dialogCustom';
import { Spinner } from '@nextui-org/react';
import { ImageListChat } from '@/components/imageList/ImageListChat';
import chatApi from '@/lib/chats/ChatApi'; // Adjust the import based on your project structure
import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType,
} from '@microsoft/signalr';
import { useSession } from 'next-auth/react';
import InfiniteScroll from 'react-infinite-scroll-component';

const Body = ({ session }) => {
  const session1 = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const { onUploadImage } = useImage();
  const [formData, setFormData] = useState({
    images: null,
  });
  const fileSchema = z.instanceof(File);
  const imageJSONSchema = z.object({
    id: z.string().min(1, 'Image must not be empty'),
    name: z.string().min(1, 'Image must not be empty'),
    url: z.string().min(1, 'Image must not be empty'),
  });
  const imageSchema = z.union([fileSchema, imageJSONSchema]);
  const formDataSchema = z.object({
    images: z.array(imageSchema),
  });
  const [messages, setMessages] = useState([]);
  const userId = session1?.data?.user?.id;
  const [connection, setConnection] = useState<null | HubConnection>(null);
  const [newMessage, setNewMessage] = useState('');
  const [temporaryMessages, setTemporaryMessages] = useState([]);
  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };
  const { data: messagesData, refetch } = useQuery({
    queryKey: ['message', userId],
    queryFn: () => chatApi.getMessagesByUser(userId),
    refetchInterval: 1000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: chatApi.sendMessageByUser,
  });

  useEffect(() => {
    if (messagesData) {
      setMessages([
        ...messagesData.value.items.map((msg) => {
          return {
            id: msg.id,
            content: msg.content,
            createdAt: new Date(msg.createdDate),
            userId: msg.user.id,
            name: msg.user.userName,
            avatatUrl: msg.user.avatarUrl,
            imageUrl: msg.imageUrl,
          };
        }),
      ]);
    }
  }, [messagesData]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const connect = new HubConnectionBuilder()
      .withUrl(
        `https://vniuvm.southeastasia.cloudapp.azure.com:5000/hubs/chat?access_token=${accessToken}`,
        {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        }
      )
      .withAutomaticReconnect()
      .build();
    setConnection(connect);
  }, []);
  if (connection) {
    connection.on('ReceiveMessage', (message) => {
      console.log('🚀 ~ connection.on ~ message:', message);
      const messageCustom = {
        id: message.id,
        content: message.content,
        createdAt: new Date(message.createdDate),
        userId: message.user.id,
        name: message.user.userName,
        avatarUrl: message.user.avatarUrl,
        imageUrl: message.imageUrl,
      };
      setMessages((prevMessage) => [...prevMessage, messageCustom]);
    });
  }

  const handleSendMessage = async () => {
    if (!newMessage && imageFiles.length === 0) return;

    if (imageFiles.length > 0) {
      const validationResult = formDataSchema.safeParse(formData);
      if (validationResult.success) {
        setIsUploading(true);
        const formData1 = new FormData();
        imageFiles.forEach((file) => {
          formData1.append('images', file);
        });
        console.log(
          '🚀 ~ file: Body.tsx:157 ~ handleSendMessage ~ formData1:',
          formData1
        );
        const images = await onUploadImage({
          formData: formData1,
          callback: () => {
            setFormData({
              images: null,
            });
            setImageFiles([]);
            setIsUploading(false);
          },
        });
        try {
          images.forEach((image) => {
            const temporaryMessage = {
              id: temporaryMessages.length + 1,
              userId: userId,
              imageUrl: image,
              createdAt: new Date().toISOString(),
            };
            setTemporaryMessages([...temporaryMessages, temporaryMessage]);
            setMessages((prevMessages) => [...prevMessages, temporaryMessage]);
            sendMessageMutation.mutate({
              body: {
                imageUrl: image,
              },
            });
          });
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
        setImageFiles([]);
      }
    }
    if (newMessage) {
      const temporaryMessage = {
        id: temporaryMessages.length + 1,
        content: newMessage,
        userId: userId,
        createdAt: new Date().toISOString(),
      };
      setTemporaryMessages([...temporaryMessages, temporaryMessage]);
      setMessages((prevMessages) => [...prevMessages, temporaryMessage]);
      sendMessageMutation.mutate({
        body: {
          content: newMessage,
        },
      });

      setNewMessage('');
    }
  };

  const handleDelete = (index) => {
    const updatedFiles = [...imageFiles];
    updatedFiles.splice(index, 1);
    setImageFiles(updatedFiles);
  };

  const handleImagesChange = () => {
    setFormData({ ...formData, images: imageFiles });
  };
  const scrollableDivRef = useRef(null);

  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop =
        scrollableDivRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className=" overflow-hidden">
      {isUploading ? (
        <DialogCustom
          className="w-[60%] lg:w-[50%] h-fit items-center justify-center"
          isModalOpen={isUploading}
          notShowClose={true}
        >
          <div className="flex flex-col gap-3 items-center justify-center">
            <Spinner size="lg" />
            <div className="text-center font-semibold text-xs sm:text-sm">
              Upload Image...
            </div>
          </div>
        </DialogCustom>
      ) : null}
      <div className="w-full">
        <div
          id="scrollableDiv"
          ref={scrollableDivRef}
          className="h-[750px] w-full overflow-y-auto flex flex-col"
          key={'11111'}
        >
          <InfiniteScroll
            dataLength={messages.length}
            next={() => {
              // fetchNextPage();
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
            // inverse={true}
            hasMore={false}
            // hasMore={hasNextPage || false}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv"
          >
            {messages.map((message, index) => (
              <MessageBox
                isLast={index === messages.length - 1}
                key={message.id}
                data={message}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>

      <div className="fixed bottom-0 py-4 px-4 bg-white border-t flex flex-col items-center gap-2 lg:gap-4 w-full z-1000">
        {imageFiles?.length ? (
          <ImageListChat
            files={imageFiles}
            height={16}
            width={16}
            onDelete={handleDelete}
          />
        ) : null}
        <div className="flex items-center flex-row w-full">
          <ImageDialog
            name="images"
            maxFiles={8}
            customButton={<HiPhoto size={30} className="text-sky-500" />}
            maxSize={1024 * 1024 * 4}
            files={imageFiles}
            setFiles={setImageFiles}
            setValue={handleImagesChange}
            disabled={false}
          />

          <div className="flex items-center gap-2 lg:gap-4 w-full">
            <textarea
              value={newMessage}
              onChange={handleNewMessageChange}
              placeholder="Type a message..."
              className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
            >
              <HiPaperAirplane size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
