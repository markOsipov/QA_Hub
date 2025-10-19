package qa_hub.service.integrations.cicd.teamcity

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.logging.HttpLoggingInterceptor
import qa_hub.service.integrations.cicd.teamcity.entity.*
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

interface TeamcityHttpInterface {
    companion object {
        var gson: Gson = GsonBuilder()
            .setLenient()
            .create()

        @OptIn(ExperimentalEncodingApi::class)
        fun getClient(apiUrl: String, user: String, password: String): TeamcityHttpInterface {
            val auth = Base64.Default.encode("$user:$password".encodeToByteArray())

            val client = OkHttpClient.Builder()
                .addInterceptor(HttpLoggingInterceptor().apply {
                    level = HttpLoggingInterceptor.Level.HEADERS
                })
                .addInterceptor { chain ->
                    val newRequest: Request = chain.request().newBuilder()
                        .addHeader(
                            "Authorization", "Basic $auth"
                        )
                        .addHeader(
                            "Content-Type", "application/json"
                        )
                        .addHeader(
                            "Accept", "application/json"
                        )
                        .build()
                    chain.proceed(newRequest)
                }.build()

            val retrofit = Retrofit.Builder()
                .baseUrl(apiUrl)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .client(client)
                .build()

            return retrofit.create(TeamcityHttpInterface::class.java)
        }
    }

    @GET("/app/rest/buildTypes/{buildConfigurationId}/branches")
    fun getBranches(
        @Path("buildConfigurationId") buildId: String,
    ): Call<TeamcityBranches>

    @POST("/app/rest/builds/id:{buildId}")
    fun cancelBuild(
        @Path("buildId") buildId: String,
        @Body body: CancelBuildRequest
    ): Call<TeamcityBuild?>

    @POST("/app/rest/buildQueue")
    fun triggerBuild(
        @Body body: TeamcityBuildRequest
    ): Call<TeamcityBuild?>

    @GET("/app/rest/builds")
    fun filterBuilds(
        @Query("locator") locator: String,
    ): Call<TeamcityFilteredBuilds?>
}