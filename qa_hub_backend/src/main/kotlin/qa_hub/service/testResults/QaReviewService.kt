package qa_hub.service.testResults

import qa_hub.entity.testRun.QaReview
import com.mongodb.client.model.Filters
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import qa_hub.entity.testRun.QaResolution
import qa_hub.entity.testRun.TestResult


@Service
class QaReviewService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val qaReviewCollection by lazy {
        mongoClient.db.getCollection<QaReview>(Collections.TEST_QA_REVIEWS.collectionName)
    }

    private val testResultsCollection by lazy {
        mongoClient.db.getCollection<TestResult>(Collections.TEST_RESULTS.collectionName)
    }

    fun getQaReview(
        testRunId: String,
        fullName: String,
    ): QaReview? = runBlocking {
        qaReviewCollection.findOne(
            Filters.and(
                QaReview::testRunId eq testRunId,
                QaReview::fullName eq fullName
            )
        )
    }

    fun updateQaReview(
        qaReview: QaReview
    ): QaReview = runBlocking {
        val filter = and(
            QaReview::testRunId eq qaReview.testRunId,
            QaReview::fullName eq qaReview.fullName,
        )
        val update = mutableListOf<SetTo<String?>>()

        qaReview.qaComment?.let{
            update.add(QaReview::qaComment setTo qaReview.qaComment)
        }

        qaReview.qaResolution?.let{
            update.add(QaReview::qaResolution setTo qaReview.qaResolution)

            launch {
                testResultsCollection.updateOne(
                    and(
                        TestResult::testRunId eq qaReview.testRunId,
                        TestResult::fullName eq qaReview.fullName
                    ),
                    set(
                        TestResult::reviewed setTo (qaReview.qaResolution != QaResolution.UNREVIEWED.value)
                    )
                )
            }
        }

        qaReviewCollection.updateOne(
            filter,
            set(*update.toTypedArray()),
            upsert()
        )

        return@runBlocking qaReviewCollection.findOne(filter)!!
    }
}