package qa_hub.service.integrations.taskTrackers.jira

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import okhttp3.Credentials
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.logging.HttpLoggingInterceptor
import qa_hub.service.integrations.taskTrackers.jira.entity.JiraIssue
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path

interface JiraHttpInterface {
    companion object {
        var gson: Gson = GsonBuilder()
            .setLenient()
            .create()

        fun getClient(baseUrl: String, username: String, apiToken: String): JiraHttpInterface {
            val client = OkHttpClient.Builder()
                .addInterceptor(HttpLoggingInterceptor().apply {
                    level = HttpLoggingInterceptor.Level.HEADERS
                })
                .addInterceptor { chain ->
                    val newRequest: Request = chain.request().newBuilder()
                        .addHeader(
                            "Authorization", Credentials.basic(username, apiToken)
                        )
                        .build()
                    chain.proceed(newRequest)
                }.build()

            val retrofit = Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .client(client)
                .build()

            return retrofit.create(JiraHttpInterface::class.java)
        }
    }

    @GET("/rest/api/latest/issue/{issue}")
    fun getIssue(
        @Path("issue") issue: String
    ): Call<JiraIssue>
}