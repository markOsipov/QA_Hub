package qa_hub.service.integrations.tms.qase

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.logging.HttpLoggingInterceptor
import qa_hub.service.integrations.tms.qase.entity.*
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*


interface QaseHttpInterface {
    companion object {
        var gson: Gson = GsonBuilder()
            .setLenient()
            .create()

        fun getClient(baseUrl: String, authToken: String): QaseHttpInterface {
            val client = OkHttpClient.Builder()
                .addInterceptor(HttpLoggingInterceptor().apply {
                    level = HttpLoggingInterceptor.Level.HEADERS
                })
                .addInterceptor { chain ->
                    val newRequest: Request = chain.request().newBuilder()
                        .addHeader(
                            "Token", authToken
                        )
                        .build()
                    chain.proceed(newRequest)
                }.build()

            val retrofit = Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .client(client)
                .build()

            return retrofit.create(QaseHttpInterface::class.java)
        }
    }

    @POST("/v1/run/{projectCode}")
    fun createTestRun(
        @Path("projectCode") projectCode: String,
        @Body request: QaseCreateTestrunRequest
    ): Call<QaseCreateTestrunResponse>

    @POST("/v1/run/{projectCode}/{testRunId}/complete")
    fun completeTestRun(
        @Path("projectCode") projectCode: String,
        @Path("testRunId") testRunId: String
    ): Call<QaseCompleteTestrunResponse>

    @GET("/v1/case/{projectCode}")
    fun getTestcases(
        @Path("projectCode") projectCode: String,
        @Query("limit") limit: Int,
        @Query("offset") size: Int
    ): Call<QaseTestcasesResponse>

    @POST("/v1/result/{projectCode}/{testRunId}")
    fun postTestResult(
        @Path("projectCode") projectCode: String,
        @Path("testRunId") testRunId: String,
        @Body request: QaseCreateTestResultRequest
    ): Call<QasePostTestResultResponse>
}