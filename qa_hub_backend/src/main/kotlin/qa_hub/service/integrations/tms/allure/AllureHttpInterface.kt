package qa_hub.service.integrations.tms.allure

import retrofit2.http.Body
import retrofit2.http.POST
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.logging.HttpLoggingInterceptor
import qa_hub.service.integrations.tms.allure.entity.AllureCreateTestrunRequest
import qa_hub.service.integrations.tms.allure.entity.AllureCreateTestrunResponse
import qa_hub.service.integrations.tms.allure.entity.AllureTestcasesResponse
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Query


interface AllureHttpInterface {
    companion object {
        var gson: Gson = GsonBuilder()
            .setLenient()
            .create()

        fun getClient(baseUrl: String, authToken: String): AllureHttpInterface {
            val client = OkHttpClient.Builder()
                .addInterceptor(HttpLoggingInterceptor().apply {
                    level = HttpLoggingInterceptor.Level.HEADERS
                })
                .addInterceptor { chain ->
                    val newRequest: Request = chain.request().newBuilder()
                        .addHeader(
                            "Authorization", "Api-Token $authToken"
                        )
                        .build()
                    chain.proceed(newRequest)
                }.build()

            val retrofit = Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .client(client)
                .build()

            return retrofit.create(AllureHttpInterface::class.java)
        }
    }

    @POST("/api/rs/launch")
    fun createTestRun(@Body request: AllureCreateTestrunRequest): Call<AllureCreateTestrunResponse>

    @GET("/api/rs/testcase")
    fun getTestcases(
        @Query("projectId") projectId: Int,
        @Query("page") page: Int,
        @Query("size") size: Int
    ): Call<AllureTestcasesResponse>
}