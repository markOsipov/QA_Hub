package qa_hub.service.integrations.cicd.github

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import okhttp3.Credentials
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.logging.HttpLoggingInterceptor
import qa_hub.service.integrations.cicd.github.entity.GithubBranch
import qa_hub.service.integrations.cicd.github.entity.StartWorkflowRequest
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface GithubHttpInterface {
    companion object {
        var gson: Gson = GsonBuilder()
            .setLenient()
            .create()

        fun getClient(apiUrl: String, apiToken: String): GithubHttpInterface {
            val client = OkHttpClient.Builder()
                .addInterceptor(HttpLoggingInterceptor().apply {
                    level = HttpLoggingInterceptor.Level.HEADERS
                })
                .addInterceptor { chain ->
                    val newRequest: Request = chain.request().newBuilder()
                        .addHeader(
                            "Authorization", "Bearer $apiToken"
                        )
                        .build()
                    chain.proceed(newRequest)
                }.build()

            val retrofit = Retrofit.Builder()
                .baseUrl(apiUrl)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .client(client)
                .build()

            return retrofit.create(GithubHttpInterface::class.java)
        }
    }

    @GET("/repos/{org}/{project}/branches")
    fun getBranches(
        @Path("org") org: String,
        @Path("project") project: String
    ): Call<List<GithubBranch>>

    @POST("/repos/{org}/{project}/actions/runs/{jobId}/cancel")
    fun cancelJob(
        @Path("org") org: String,
        @Path("project") project: String,
        @Path("jobId") jobId: String
    ): Call<Any?>

    @POST("/repos/{org}/{project}/actions/workflows/{workflowId}/dispatches")
    fun startWorkflow(
        @Path("org") org: String,
        @Path("project") project: String,
        @Path("workflowId") jobId: String,
        @Body body: StartWorkflowRequest
    ): Call<Any?>
}