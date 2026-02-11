# from youtube_transcript_api import YouTubeTranscriptApi
# from urllib.parse import urlparse
# from translate import Translator
# # # def ExtractTranscript(url:str)->str:
# # #     """Accepts a youtube url and returns Youtube Video Transcript"""
# # #     ytt_api = YouTubeTranscriptApi()
   
# # #     if(url.startswith('https://youtu.be/')):
# # #         start = url.index("https://youtu.be/") + len("https://youtu.be/")
# # #         end = url.index("?")
# # #         id=url[start:end]
# # #         transcript_list = ytt_api.list(id)
# # #         manualtranscripts = transcript_list.find_manually_created_transcript(['en', 'hi'])
# # #         autotranscripts=transcript_list.find_generated_transcript(['en', 'hi'])

# # #         yt=ytt.fetch(id)
# # #         transcript=""
# # #         for i in range(0,len(yt)):
# # #             t=yt[i].text
# # #             transcript=transcript+t+" "
# # #         return transcript    
# # #     elif(url.startswith('https://www.youtube.com/')):
# # #         url='https://www.youtube.com/watch?v=wVgmN9TXPiU'
# # #         id=(urlparse(url).query)[2:]
# # #         yt=ytt_api.fetch(id)
        
# # #         transcript=""
# # #         for i in range(0,len(yt)):
# # #             t=yt[i].text
# # #             transcript=transcript+t+" "   
# # #         return transcript
             
# # # trans=ExtractTranscript('https://youtu.be/f8npDOBLoR4?si=lvDQt29pCspsk8cR')   
# # # print(trans )    

# # try:
# #     ytt_api = YouTubeTranscriptApi()
# #     transcript_list = ytt_api.list('sn9hZoCYbm4')
# #     try:
# #         manualtranscripts = transcript_list.find_manually_created_transcript(['en', 'es', 'fr', 'de', 'ja', 'ru', 'ar','hi','zh-Hans', 'bn', 'mr', 'ta', 'te', 'gu'])
# #         transcript_data = manualtranscripts.fetch()
        
# #         transcript=""
# #         for i in range(0,len(transcript_data)):
# #             t=transcript_data[i].text
# #             transcript=transcript+t+" "
# #         print(transcript)  
# #     except:    
# #         autotranscripts=transcript_list.find_generated_transcript(['en', 'es', 'fr', 'de', 'ja', 'ru', 'ar','hi','zh-Hans', 'bn', 'mr', 'ta', 'te', 'gu'])
# #         transcript_data = autotranscripts.fetch()
# #         transcript=""
# #         for i in range(0,len(transcript_data)):
# #             t=transcript_data[i].text
# #             transcript=transcript+t+" "
# #         print(transcript)  
# # except:
# #     print("Error")


# def translateToEn(non_en_transcript:str)->str:
    
#     translator = Translator(to_lang="en")
#     translation = translator.translate(non_en_transcript)
#     return translation

# final=translateToEn('Yo creo que sí, que que hoy por hoy eh la marca Inter de Miami es es muy fuerte, no solo a nivel de Estados Unidos, sino a nivel grupal. Creo que que el club hizo un cambio muy grande y y creció de todos lados, ¿no? A nivel a nivel deportivo, a nivel institucional y creo que que tiene mucho más todavía para para seguir creciendo y y seguir siendo mejores desde desde todos lados. Bueno, yo creo que eh que crezca el fútbol de de Estados Unidos eh es posible. Creo que que hay que hacer cambios grandes todavía para que para que los equipos siga puedan seguir eh creciendo, pero creo que hay una base muy importante la cual eh los equipos eh están preparados y quieren quieren ese crecimiento y creo que que es momento de de hacerlo, ¿no? Bueno, para empezar que que haya que cada equipo tenga sus posibilidades de traer jugadores y puedan fichar lo que lo que lo que cada equipo quiera y pretenda, sin tener limitaciones ni ni regla para que encajen eh los jugadores. Yo creo que hoy eh todos los equipos de Estados Unidos, todos los clubs tienen el eh el poder de de poder hacerlo y que creo que si se le dieran la libertad vendrían muchos más jugadores importantes que ayudarían al crecimiento de Estados Unidos. Ya que nos encontraste, no nos pierdas. Suscríbete al canal de YouTube de Telemundo Deportes.')

# print(final)




